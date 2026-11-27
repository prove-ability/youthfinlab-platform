const fs = require("fs"),
  path = require("path"),
  { createRequire } = require("module");
const repo = path.resolve(__dirname, "../.."),
  out = path.join(repo, "node_modules/.cache/loading-preview");
fs.mkdirSync(out, { recursive: true });
const esbuild = createRequire(require.resolve("vite/package.json"))("esbuild");
const cases = {
  clients: [
    "admin",
    "app/protected/clients/components/client-list",
    "ClientList",
  ],
  dashboard: [
    "admin",
    "app/protected/dashboard/components/DashboardClient",
    "DashboardClient",
  ],
  classes: [
    "admin",
    "app/protected/classes/components/class-list",
    "ClassList",
  ],
  game: ["admin", "app/protected/game-management/page"],
  stocks: ["admin", "app/protected/stock-management/page"],
  profile: ["finance-sim", "app/simulation/profile/page"],
  snapshot: ["finance-sim", "app/simulation/snapshot/page"],
  report: ["finance-sim", "app/simulation/report/page"],
  analysis: ["stock-sim", "app/analysis/page"],
  home: ["stock-sim", "app/page"],
  news: ["stock-sim", "app/news/page"],
  ranking: ["stock-sim", "app/ranking/page"],
  invest: ["stock-sim", "app/invest/page"],
};
(async () => {
  for (const [name, [app, entry, exportName]] of Object.entries(cases)) {
    const root = path.join(repo, "apps", app),
      appRequire = createRequire(path.join(root, "package.json"));
    await esbuild.build({
      stdin: {
        contents: `import {createRoot} from 'react-dom/client';import {QueryClient,QueryClientProvider} from '@tanstack/react-query';import ${exportName ? "{" + exportName + " as Screen}" : "Screen"} from './${entry}';const client=new QueryClient({defaultOptions:{queries:{retry:false,refetchOnWindowFocus:false}}});window.queryClient=client;createRoot(document.getElementById('root')).render(<QueryClientProvider client={client}><Screen/></QueryClientProvider>);`,
        resolveDir: root,
        loader: "tsx",
      },
      bundle: true,
      jsx: "automatic",
      outfile: path.join(out, name + ".js"),
      define: { "process.env.NODE_ENV": '"production"' },
      plugins: [
        {
          name: "isolated-actions",
          setup(b) {
            b.onResolve({ filter: /^@\/actions\// }, (a) => ({
              path: a.path,
              namespace: "test-actions",
              pluginData: {
                root: app === "admin" ? path.join(root, "src") : root,
              },
            }));
            b.onLoad({ filter: /.*/, namespace: "test-actions" }, (a) => {
              const src = fs.readFileSync(
                path.join(a.pluginData.root, a.path.slice(2) + ".ts"),
                "utf8",
              );
              const names = [
                ...src.matchAll(
                  /export\s+(?:async\s+)?(?:function|const)\s+(\w+)/g,
                ),
              ].map((m) => m[1]);
              return {
                contents: names
                  .map(
                    (n) =>
                      `export const ${n}=(...args)=>window.loadingRequest('${n}',args);`,
                  )
                  .join("\n"),
              };
            });
            b.onResolve(
              { filter: /^next\/(navigation|link|image)$|^@\/hooks\/useTour$/ },
              (a) => ({ path: a.path, namespace: "test-platform" }),
            );
            b.onLoad({ filter: /.*/, namespace: "test-platform" }, (a) => ({
              loader: "tsx",
              resolveDir: root,
              contents:
                a.path === "next/navigation"
                  ? `const router={push:p=>window.loadingTest.navigation=p,replace:p=>window.loadingTest.navigation=p,refresh:()=>{}};export const useRouter=()=>router;export const useSearchParams=()=>new URLSearchParams();export const usePathname=()=>'/';`
                  : a.path.includes("useTour")
                    ? "export const useTour=()=>{};"
                    : a.path === "next/image"
                      ? `export default function Image({src,alt,...props}){return <img src={src} alt={alt}/>}`
                      : `export default function Link({href,children,...props}){return <a href={href} {...props}>{children}</a>}`,
            }));
          },
        },
      ],
    });
    const tw = appRequire("@tailwindcss/postcss"),
      postcss = createRequire(appRequire.resolve("@tailwindcss/postcss"))(
        "postcss",
      ),
      from = path.join(root, "app/globals.css");
    const css = (
      await postcss([tw({ base: root })]).process(
        fs.readFileSync(from, "utf8"),
        { from },
      )
    ).css;
    fs.writeFileSync(
      path.join(out, name + "-base.css"),
      css +
        "\n" +
        fs.readFileSync(path.join(repo, "packages/ui/src/brand.css"), "utf8") +
        "\n" +
        fs.readFileSync(
          path.join(repo, "packages/ui/src/editorial.css"),
          "utf8",
        ) +
        (app === "admin"
          ? "\n" +
            fs.readFileSync(
              path.join(root, "app/protected/workspace.css"),
              "utf8",
            )
          : ""),
    );
    fs.writeFileSync(
      path.join(out, name + ".html"),
      `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>로딩·실패·재시도 검증 — ${name}</title><link rel="icon" href="data:,"><link rel="stylesheet" href="${name}-base.css"><link rel="stylesheet" href="${name}.css"><style>body{margin:0;background:white}header{padding:16px;border-bottom:1px solid #ccc;font:14px system-ui}header a,header button{margin:4px;padding:8px;display:inline-block;border:1px solid #748278;border-radius:4px}main{padding:16px;max-width:1050px;margin:auto;min-width:0}</style><header>로컬 샘플 검증 · 운영 데이터에 연결하지 않습니다.<nav>${Object.keys(
        cases,
      )
        .map(
          (k) =>
            `<a href="${k}.html">${{ clients: "고객사", dashboard: "대시보드", classes: "클래스", game: "게임 관리", stocks: "주식 관리", profile: "재무 입력", snapshot: "재무 현황", report: "재무 보고서", analysis: "투자 분석", home: "게임 홈", news: "뉴스", ranking: "랭킹", invest: "투자" }[k]}</a>`,
        )
        .join(
          "",
        )}</nav><a href="?mode=success">성공</a><a href="?mode=fail">최초 실패 후 재시도 성공</a><a href="?mode=always-fail">반복 실패</a><a href="?mode=slow">느린 응답</a><button id="refresh-fail">갱신 실패</button><button id="refresh-ok">갱신 복구</button></header><main class="yfl-editorial ${app === "admin" ? "yfl-admin-content" : ""}"><div id="root"></div></main><script>window.process={env:{NODE_ENV:'production'}};</script><script src="scenario.js"></script><script src="${name}.js"></script></html>`,
    );
  }
  fs.copyFileSync(
    path.join(__dirname, "scenario.js"),
    path.join(out, "scenario.js"),
  );
  console.log(out);
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
