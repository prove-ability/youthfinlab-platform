import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MarketScenarioPanel from "../../apps/admin/src/components/game/MarketScenarioPanel";
import MarketEventPanel from "../../apps/stock-sim/components/MarketEventPanel";
import { state, stocks, scenario } from "./fixtures";
import sprout from "../../packages/ui/src/sprout-felt-web.webp";
import "./preview.css";
const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
function Preview() {
  const [view, setView] = useState(
    new URLSearchParams(location.search).get("view") || "student",
  );
  const [day, setDay] = useState(state.day);
  const [fresh, setFresh] = useState(0);
  const [failSave, setFailSave] = useState(false);
  const [failRead, setFailRead] = useState(false);
  const refresh = () => client.invalidateQueries();
  return (
    <>
      <aside className="preview-toolbar">
        <strong>로컬 미리보기</strong>
        <span>가상 데이터 · 운영 서버와 연결하지 않습니다</span>
        <nav aria-label="미리보기 화면">
          <button
            onClick={() => setView("student")}
            aria-pressed={view === "student"}
          >
            학생 화면
          </button>
          <button
            onClick={() => setView("admin")}
            aria-pressed={view === "admin"}
          >
            관리자 설정
          </button>
        </nav>
        <div className="preview-options">
          <label>
            진행 Day
            <select
              value={day}
              onChange={(e) => {
                state.day = Number(e.target.value);
                setDay(state.day);
                refresh();
              }}
            >
              {scenario.days.map(({ day: d }) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={failSave}
              onChange={(e) => {
                state.failSave = e.target.checked;
                setFailSave(e.target.checked);
              }}
            />
            저장 실패 재현
          </label>
          <label>
            <input
              type="checkbox"
              checked={failRead}
              onChange={(e) => {
                state.failRead = e.target.checked;
                setFailRead(e.target.checked);
                refresh();
              }}
            />
            읽기 실패 재현
          </label>
          <button
            onClick={() => {
              state.configured = false;
              setFresh((x) => x + 1);
              setView("admin");
              refresh();
            }}
          >
            새 수업 설정 체험
          </button>
        </div>
      </aside>
      <header className="preview-brand">
        <strong>youthfinlab</strong>
        <span>{view === "student" ? "투자 게임" : "관리자 · 게임 관리"}</span>
        <img src={sprout} alt="유스핀랩 새싹" />
      </header>
      <main
        className={view === "student" ? "preview-main student" : "preview-main"}
      >
        <p className="preview-eyebrow">
          {view === "student"
            ? "오늘의 시장을 읽고, 나의 판단을 남겨요"
            : "수업의 흐름을 먼저 준비하세요"}
        </p>
        <h1>{view === "student" ? "뉴스 너머의 선택" : "게임 관리"}</h1>
        {view === "admin" ? (
          <MarketScenarioPanel
            key={fresh}
            classId="preview-course"
            stocks={stocks}
            onConfigured={refresh}
          />
        ) : (
          <>
            <MarketEventPanel />
            <div className="preview-assets">
              <span>내 자산 · 예시</span>
              <strong>1,024,600원</strong>
              <p>실제 앱에서는 이 아래에 기존 자산·거래 화면이 이어집니다.</p>
            </div>
          </>
        )}
      </main>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <Preview />
  </QueryClientProvider>,
);
