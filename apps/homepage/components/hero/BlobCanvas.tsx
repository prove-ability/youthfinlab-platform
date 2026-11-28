"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 히어로 3D 블롭.
 *
 * - three.js는 동적 import라 초기 번들에 들어가지 않는다.
 * - WebGL을 못 쓰거나 로딩 전에는 CSS 블롭이 대신 보인다.
 * - prefers-reduced-motion이면 정지된 한 프레임만 렌더한다.
 * - 화면 밖으로 나가면 렌더 루프를 멈춘다.
 */

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uNoise;
  uniform float uFreq;
  uniform float uSeed;
  uniform vec2  uPointer;
  uniform float uPointerStrength;

  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisp;

  //
  // Ashima simplex noise 3D
  //
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  // 구를 반지름 방향으로 밀어 블롭을 만든다
  vec3 displace(vec3 p, out float outDisp) {
    // 저주파 한 겹이 큰 덩어리를, 고주파 한 겹이 미세한 결을 만든다.
    // 고주파 비중을 낮게 잡아야 표면이 자잘해지지 않는다.
    float n1 = snoise(p * uFreq + vec3(uSeed, uSeed * 1.7, uTime * 0.14));
    float n2 = snoise(p * uFreq * 2.1 + vec3(uTime * 0.09, uSeed, 0.0)) * 0.16;
    float d = (n1 + n2) * uNoise;

    // 마우스가 향한 쪽이 부풀어 오른다
    vec3 dir = normalize(vec3(uPointer * 1.3, 1.0));
    d += pow(max(dot(normalize(p), dir), 0.0), 3.0) * uPointerStrength;

    outDisp = d;
    return p * (1.0 + d);
  }

  void main() {
    float d;
    vec3 p0 = displace(position, d);
    vDisp = d;

    // 변위된 표면의 법선을 이웃 두 점으로 근사한다
    vec3 axis = abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(normal, axis));
    vec3 bitangent = normalize(cross(normal, tangent));

    float ignored;
    float eps = 0.03;
    vec3 p1 = displace(position + tangent * eps, ignored);
    vec3 p2 = displace(position + bitangent * eps, ignored);

    vec3 n = normalize(cross(p1 - p0, p2 - p0));
    if (dot(n, normalize(p0)) < 0.0) n = -n;

    vNormal = n;
    vPos = p0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uMint;

  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisp;

  void main() {
    vec3 n = normalize(vNormal);

    // 좌상단 주광 + 우하단 보조광 + 넉넉한 환경광.
    // 환경광 바닥을 높게 잡아야 어느 각도에서도 탁해지지 않는다.
    float key  = max(dot(n, normalize(vec3(-0.35, 0.5, 0.8))), 0.0);
    float fill = max(dot(n, normalize(vec3(0.55, -0.45, 0.6))), 0.0) * 0.5;
    float light = clamp(0.62 + key * 0.32 + fill * 0.28, 0.0, 1.0);

    // 좌하단이 밝은 민트, 우상단으로 갈수록 진한 그린.
    // 순수 y가 아니라 대각선으로 잡아야 하이라이트가 한쪽으로 몰린다.
    float h = clamp((vPos.y + vPos.x * 0.45 + 1.5) / 3.0, 0.0, 1.0);
    vec3 col = mix(uMint, uMid, smoothstep(-0.05, 0.62, h));
    col = mix(col, uDeep, smoothstep(0.68, 1.25, h));

    col = mix(col * 0.94, col, light);

    // 솟아오른 부분에 하이라이트
    col += uMint * clamp(vDisp, 0.0, 1.0) * 0.18;

    // 가장자리 림라이트로 입체감 보강
    float rim = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
    col += uMint * rim * 0.12;

    gl_FragColor = vec4(col, 1.0);

    // three는 THREE.Color를 선형 색공간으로 변환해 넘긴다.
    // ShaderMaterial은 출력 변환을 자동으로 걸어주지 않으므로
    // 이 청크로 직접 sRGB로 되돌려야 지정한 HEX 그대로 보인다.
    #include <colorspace_fragment>
  }
`;

type Props = {
  className?: string;
  /** 블롭 표면의 울퉁불퉁한 정도 */
  noise?: number;
};

/**
 * 화면에 놓을 덩어리들.
 * 좌표는 카메라에 보이는 영역 대비 비율이라 화면 크기가 바뀌어도
 * 같은 모서리에 붙어 있는다.
 */
const BLOBS = [
  { x: -0.46, y: 0.44, scale: 0.8, seed: 0, spin: 1 },
  { x: 0.48, y: -0.5, scale: 1.05, seed: 11.3, spin: -0.8 },
];

export default function BlobCanvas({ className, noise = 0.32 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed || !hostRef.current) return;

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      let reduceMotion = motionQuery.matches;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        return; // WebGL 미지원 → CSS 폴백 유지
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 4.2;

      // 덩어리가 둘로 늘었으니 세분화를 낮춰 정점 수를 맞춘다
      const geometry = new THREE.IcosahedronGeometry(1, 48);

      const parts = BLOBS.map((cfg) => {
        const uniforms = {
          uTime: { value: 0 },
          uNoise: { value: noise },
          uFreq: { value: 0.52 },
          uSeed: { value: cfg.seed },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uPointerStrength: { value: 0 },
          uDeep: { value: new THREE.Color("#7FBF9E") },
          uMid: { value: new THREE.Color("#6FDCB2") },
          uMint: { value: new THREE.Color("#A5F5CE") },
        };
        const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        return { cfg, mesh, material, uniforms };
      });

      renderer.setClearColor(0x000000, 0);
      hostRef.current.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        if (!w || !h) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        // 카메라에 보이는 실제 크기를 구해 모서리에 비율로 배치한다
        const visibleH =
          2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
        const visibleW = visibleH * camera.aspect;
        const unit = Math.max(visibleW, visibleH);

        parts.forEach(({ cfg, mesh }) => {
          mesh.position.set(visibleW * cfg.x, visibleH * cfg.y, 0);
          mesh.scale.setScalar(unit * 0.36 * cfg.scale);
        });
      };

      // 포인터는 목표값만 갱신하고 렌더 루프에서 부드럽게 따라간다
      const target = { x: 0, y: 0, strength: 0 };
      const current = { x: 0, y: 0, strength: 0 };

      const onPointerMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        target.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        target.strength = 0.16;
      };
      const onPointerLeave = () => {
        target.strength = 0;
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave);

      let visible = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !reduceMotion) loop();
        },
        { threshold: 0 }
      );
      io.observe(host);

      let raf = 0;
      const clock = new THREE.Clock();

      const draw = (t: number) => {
        current.x += (target.x - current.x) * 0.055;
        current.y += (target.y - current.y) * 0.055;
        current.strength += (target.strength - current.strength) * 0.055;

        parts.forEach(({ cfg, mesh, uniforms }) => {
          uniforms.uTime.value = t;
          uniforms.uPointer.value.set(current.x, current.y);
          uniforms.uPointerStrength.value = current.strength;

          // 포인터를 향해 약하게 기운다. 둘이 반대로 돌아 리듬을 만든다.
          mesh.rotation.y = current.x * 0.28 + t * 0.05 * cfg.spin;
          mesh.rotation.x = current.y * -0.22;
        });

        renderer.render(scene, camera);
      };

      const loop = () => {
        cancelAnimationFrame(raf);
        const tick = () => {
          if (disposed || !visible || reduceMotion) return;
          draw(clock.getElapsedTime());
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };

      const redraw = () => {
        resize();
        draw(reduceMotion ? 0 : clock.getElapsedTime());
      };
      const ro = new ResizeObserver(redraw);
      ro.observe(host);
      redraw();
      const onMotionChange = () => {
        reduceMotion = motionQuery.matches;
        cancelAnimationFrame(raf);
        if (reduceMotion) draw(0);
        else if (visible) loop();
      };
      motionQuery.addEventListener("change", onMotionChange);

      setReady(true);
      if (reduceMotion) draw(0);
      else loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        motionQuery.removeEventListener("change", onMotionChange);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerleave", onPointerLeave);
        geometry.dispose();
        parts.forEach(({ material }) => material.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [noise]);

  return (
    <div className={className}>
      {/* WebGL 준비 전/미지원 시 보이는 CSS 폴백 */}
      <div
        aria-hidden
        className={`blob-fallback absolute inset-0 transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
      <div ref={hostRef} className="absolute inset-0" aria-hidden />
    </div>
  );
}
