"use client";

import { useEffect } from "react";

/**
 * 홈 스크롤 모드 스위치.
 *
 * 처음에는 모든 섹션을 한 화면씩 강제로 넘겼는데, 섹션이 일곱 개라
 * 푸터까지 반드시 일곱 번을 굴려야 했고 건너뛸 수도 없었다.
 * 내용이 가벼운 섹션은 한 화면을 억지로 채우게 되고,
 * 내용이 많은 섹션은 화면에 맞추려 축소돼야 했다.
 *
 * 그래서 "전부 스냅"을 버리고 골라서 건다.
 * data-screen이 붙은 섹션만 한 화면을 차지하고 위쪽에 정렬되며,
 * 나머지는 내용 높이만큼만 쓰고 자유롭게 흘러간다.
 * 휠은 가로채지 않는다. 실제 정렬은 CSS scroll-snap(proximity)이 맡는다.
 *
 * 이 컴포넌트가 하는 일은 홈에서만, 그리고 데스크톱에서만
 * 그 규칙을 켜주는 것뿐이다. 클래스를 html에 붙여야 하는 이유는
 * 스크롤 컨테이너가 문서 자체이기 때문이다.
 */

const ENABLE_QUERY = "(min-width: 1024px) and (min-height: 640px)";

export default function ScrollSnap() {
  useEffect(() => {
    const root = document.documentElement;
    const wide = window.matchMedia(ENABLE_QUERY);

    const sync = () => {
      root.classList.toggle("snap-page", wide.matches);
    };

    sync();
    wide.addEventListener("change", sync);

    return () => {
      wide.removeEventListener("change", sync);
      root.classList.remove("snap-page");
    };
  }, []);

  return null;
}
