"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  configureMarketScenario,
  getMarketScenarioAdmin,
} from "@/actions/marketScenarioActions";
import {
  defaultEventStocks,
  exposureLabels,
  reasonLabels,
  type Exposure,
} from "@repo/db/market-scenario";
import "@repo/ui/market-event.css";

export default function MarketScenarioPanel({
  classId,
  stocks,
  onConfigured,
}: {
  classId: string;
  stocks: { id: string; name: string }[];
  onConfigured: () => Promise<unknown>;
}) {
  const [mode, setMode] = useState("basic");
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">(
    "normal",
  );
  const [useCustom, setUseCustom] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const query = useQuery({
    queryKey: ["market-scenario-admin", classId],
    queryFn: async () => {
      const result = await getMarketScenarioAdmin(classId);
      if (!("scenario" in result))
        throw new Error(result.message || "이벤트 설정을 불러오지 못했습니다.");
      return result;
    },
    refetchInterval: 30000,
  });
  const data = query.data;
  return (
    <section className="market-event" aria-labelledby="market-settings-title">
      <p className="event-kicker">수업 모드</p>
      <h2 id="market-settings-title">금융 위기를 경험하는 수업</h2>
      <p className="event-muted">
        기본 게임은 그대로, 새로운 수업에서는 공통 사건 속에서 판단을
        연습합니다.
      </p>
      <details className="event-rule" open={data ? !data.scenario : false}>
        <summary>처음 사용하는 강사를 위한 진행 안내</summary>
        <ol>
          <li>
            수업 준비: AI 자동 생성을 끈 새 수업에서 이벤트 모드와 난이도를
            고르고 확정하세요. 기본 기업 3개가 자동 준비됩니다.
          </li>
          <li>
            학생 참여: 수업을 시작하고 오늘의 속보를 읽게 합니다. 거래·관망을
            판단한 뒤 이유를 저장하게 하세요.
          </li>
          <li>
            다음 Day: 아래 기록 완료 인원을 확인하고 기존 Day +1 버튼을
            누르세요. 미작성자가 있으면 확인 후 진행할 수 있습니다.
          </li>
          <li>
            함께 회고: 다음 Day에는 이전 선택·자산 변화·해설이 공개됩니다. Day
            10은 새 거래 없이 전체 선택을 돌아봅니다.
          </li>
        </ol>
      </details>
      <p className="event-callout">
        이벤트 수업은 난이도별 사건·가격 경로가 고정되어 있습니다. 같은 난이도로
        반복하면 같은 흐름을 경험합니다. 실제 시장 예측이 아닌 판단
        연습용입니다.
      </p>
      {query.isPending && <p role="status">이벤트 설정을 불러오는 중…</p>}
      {query.isError && (
        <div className="event-stack">
          <p role="alert" className="event-error">
            설정을 불러오지 못했습니다.
          </p>
          <button
            type="button"
            disabled={query.isFetching}
            onClick={() => query.refetch()}
          >
            다시 불러오기
          </button>
        </div>
      )}
      {data?.scenario ? (
        <div className="event-stack">
          <div className="event-callout" role="status">
            <strong>
              Day {data.currentDay} ·{" "}
              {data.status === "active" &&
              data.currentDay < data.scenario.days.length
                ? "이유 기록 현황"
                : "수업 기록 현황"}
            </strong>
            {data.currentDay < data.scenario.days.length ? (
              <p>
                기록 완료 {data.participation.completed} / 전체{" "}
                {data.participation.total}명 · 미작성{" "}
                {data.participation.missing}명
              </p>
            ) : (
              <p>최종 회고 Day입니다. 새 이유는 작성하지 않습니다.</p>
            )}
            <p className="event-muted">
              30초마다 갱신합니다. Day +1을 누르면 최신 미작성 인원을 다시
              확인합니다. 이유 저장은 거래와 별개입니다.
            </p>
            <button
              type="button"
              disabled={query.isFetching}
              onClick={() => query.refetch()}
            >
              기록 현황 새로고침
            </button>
          </div>
          <div className="event-tags">
            <span className="event-tag">
              금융 위기 · {data.scenario.days.length}일
            </span>
            <span className="event-tag">
              {data.scenario.difficulty === "easy"
                ? "쉬움 · 완만한 변동"
                : data.scenario.difficulty === "hard"
                  ? "어려움 · 복합 정보 판단"
                  : "보통"}
            </span>
            <span className="event-tag">시나리오 확정</span>
          </div>
          <p>
            기존 Day +1 버튼으로 진행하세요. 확정된 가격·뉴스는 수정하거나
            되돌릴 수 없습니다. Day {data.scenario.days.length}은 거래 없이
            결과를 돌아보는 날입니다.
          </p>
          <p className="event-muted">
            모든 수치는 교육용 가상 설정입니다. 실제 기업 평가나 미래 수익
            예측이 아닙니다. 선택 이유는 순위 점수에 포함되지 않습니다.
          </p>
          <details>
            <summary>교사용 시나리오·가격 확인</summary>
            <p className="event-muted">
              학생에게는 현재까지의 속보와 지난 선택의 해설만 공개됩니다.
            </p>
            <div
              className="event-table-scroll"
              tabIndex={0}
              role="region"
              aria-label="일차별 시나리오 가격"
            >
              <table>
                <caption>시작 가격과 기업 특성별 가상 경로</caption>
                <thead>
                  <tr>
                    <th scope="col">종목 · 특성</th>
                    {data.scenario.days.map((d) => (
                      <th scope="col" key={d.day}>
                        Day {d.day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.scenario.stocks.map((s) => (
                    <tr key={s.stockId}>
                      <th scope="row">
                        {s.name} · {exposureLabels[s.exposure]}
                      </th>
                      {data.scenario!.days.map((d) => (
                        <td key={d.day}>
                          {d.prices
                            .find((p) => p.stockId === s.stockId)
                            ?.price.toLocaleString()}
                          원
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.scenario.days.map((d) => (
              <article className="event-history" key={d.day}>
                <h3>
                  Day {d.day} · {d.title}
                </h3>
                <p>{d.news}</p>
                {d.day < data.scenario!.days.length && (
                  <p className="event-muted">
                    다음 Day에 공개할 해설: {d.explanation}
                  </p>
                )}
              </article>
            ))}
          </details>
          <details>
            <summary>학생의 선택 이유 ({data.decisions.length}건)</summary>
            <p className="event-muted">
              선택 이유는 학생이 직접 남긴 기록이며 실제 매매 내역과 다를 수
              있습니다.
            </p>
            {data.decisions.length === 0 ? (
              <p>아직 기록된 이유가 없습니다.</p>
            ) : (
              data.decisions.map((d, i) => (
                <article className="event-history" key={i}>
                  <h3>
                    Day {d.day} · {d.name}
                  </h3>
                  <p>{reasonLabels[d.reason]}</p>
                  {d.note && <p>{d.note}</p>}
                </article>
              ))
            )}
          </details>
        </div>
      ) : (
        data && (
          <form
            className="event-stack"
            aria-labelledby="market-settings-title"
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy || mode !== "crisis") return;
              setError("");
              if (useCustom && (selected.length < 2 || selected.length > 12)) {
                setError("종목을 2~12개 선택하세요.");
                return;
              }
              const form = new FormData(e.currentTarget);
              setBusy(true);
              try {
                const result = await configureMarketScenario({
                  classId,
                  difficulty,
                  stocks: useCustom
                    ? selected.map((stockId) => ({
                        stockId,
                        exposure: form.get(`exposure-${stockId}`) as Exposure,
                        initialPrice: Number(form.get(`price-${stockId}`)),
                      }))
                    : undefined,
                });
                if (!result.success)
                  throw new Error(
                    result.message || "설정을 저장하지 못했습니다.",
                  );
                await query.refetch();
                await onConfigured();
              } catch (e) {
                setError(
                  e instanceof Error
                    ? e.message
                    : "저장하지 못했습니다. 다시 시도해 주세요.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <fieldset disabled={busy}>
              <legend>게임 모드</legend>
              <div className="event-stack">
                <label className="event-choice">
                  <input
                    name="gameMode"
                    type="radio"
                    value="basic"
                    checked={mode === "basic"}
                    onChange={() => setMode("basic")}
                  />
                  기본 모드 · 기존 뉴스와 거래
                </label>
                <label className="event-choice">
                  <input
                    name="gameMode"
                    type="radio"
                    value="crisis"
                    checked={mode === "crisis"}
                    onChange={() => setMode("crisis")}
                  />
                  금융 위기 이벤트 · 10일 체험
                </label>
              </div>
            </fieldset>
            {mode === "crisis" && (
              <>
                <p className="event-callout">
                  AI 자동 생성을 끈 새 수업에서 설정하세요. 학생·가격·뉴스가
                  아직 없어야 하며, 저장하면 총 10일로 설정됩니다. 기존 수업의
                  데이터를 지우거나 덮어쓰지 않습니다.
                </p>
                <p>
                  Day 1~2 관찰 → Day 3 자금 조달 불안 → Day 4 위기 → Day 5 대응
                  → Day 6~9 추가 불안과 회복 → Day 10 돌아보기
                </p>
                <fieldset disabled={busy}>
                  <legend>난이도</legend>
                  <div className="event-stack">
                    <label className="event-choice">
                      <input
                        name="crisisDifficulty"
                        type="radio"
                        checked={difficulty === "normal"}
                        onChange={() => setDifficulty("normal")}
                      />
                      보통 · 뚜렷한 위기와 반등 체험
                    </label>
                    <label className="event-choice">
                      <input
                        name="crisisDifficulty"
                        type="radio"
                        checked={difficulty === "easy"}
                        onChange={() => setDifficulty("easy")}
                      />
                      쉬움 · 쉬운 표현과 완만한 가격 변동
                    </label>
                    <label className="event-choice">
                      <input
                        name="crisisDifficulty"
                        type="radio"
                        checked={difficulty === "hard"}
                        onChange={() => setDifficulty("hard")}
                      />
                      어려움 · 복합 정보와 큰 충격·재하락
                    </label>
                    {difficulty === "hard" && (
                      <p className="event-muted">
                        좋은 소식과 나쁜 소식이 함께 제시됩니다. 기업마다 다른
                        급락·반등·재하락을 살피고 선택 이유를 남깁니다. 기본
                        거래·지원금 규칙은 보통과 같습니다.
                      </p>
                    )}
                  </div>
                </fieldset>
                <div className="event-callout">
                  <strong>
                    {useCustom ? "직접 구성 사용" : "기본 구성 자동 적용"}
                  </strong>
                  {!useCustom && (
                    <>
                      <p>가상 기업 3개 · 시작 가격 각각 10,000원</p>
                      <ul>
                        {defaultEventStocks.map((s) => (
                          <li key={s.name}>
                            {s.name} · {exposureLabels[s.exposure]}
                          </li>
                        ))}
                      </ul>
                      <p>확정할 때 이 수업용 종목을 자동으로 준비합니다.</p>
                    </>
                  )}
                  {useCustom && (
                    <p>
                      고급 설정에서 선택한 {selected.length}개 종목을
                      사용합니다.
                    </p>
                  )}
                </div>
                <details>
                  <summary>
                    고급 설정 · 종목 직접 수정{useCustom ? " (사용 중)" : ""}
                  </summary>
                  <label className="event-choice">
                    <input
                      type="checkbox"
                      checked={useCustom}
                      disabled={busy}
                      onChange={(e) => setUseCustom(e.target.checked)}
                    />
                    직접 구성 사용
                  </label>
                  <p className="event-muted">
                    직접 구성을 끄면 기본 기업 3개로 확정합니다. 고급 설정을
                    접어도 직접 구성 선택은 유지됩니다.
                  </p>
                  <fieldset disabled={busy || !useCustom}>
                    <legend>종목과 가상 기업 특성 · 2~12개 선택</legend>
                    <p className="event-muted">
                      실제 기업의 특성이 아닌 이 수업에서의 역할입니다. 두 가지
                      이상의 특성을 골라 주세요. 현금은 별도로 유지할 수
                      있습니다.
                    </p>
                    {stocks.map((s, i) => (
                      <div className="event-stock" key={s.id}>
                        <label className="event-choice">
                          <input
                            name="stock"
                            value={s.id}
                            type="checkbox"
                            checked={selected.includes(s.id)}
                            onChange={(e) =>
                              setSelected((ids) =>
                                e.target.checked
                                  ? [...ids, s.id]
                                  : ids.filter((id) => id !== s.id),
                              )
                            }
                          />
                          {s.name}
                        </label>
                        {selected.includes(s.id) && (
                          <>
                            <label>
                              가상 기업 특성
                              <select
                                name={`exposure-${s.id}`}
                                defaultValue={
                                  Object.keys(exposureLabels)[i % 3]
                                }
                              >
                                {Object.entries(exposureLabels).map(
                                  ([value, label]) => (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  ),
                                )}
                              </select>
                            </label>
                            <label>
                              시작 가격 (원)
                              <input
                                name={`price-${s.id}`}
                                type="number"
                                min={1000}
                                max={1000000}
                                step={1}
                                required
                                defaultValue={10000}
                              />
                            </label>
                          </>
                        )}
                      </div>
                    ))}
                    {stocks.length < 2 && (
                      <p>주식 관리에서 종목을 2개 이상 등록해 주세요.</p>
                    )}
                  </fieldset>
                </details>
                <p className="event-muted">
                  저장 후에는 모드·가격·뉴스를 변경할 수 없습니다. 다른 설정은
                  새 수업으로 만드세요.
                </p>
                <button type="submit" disabled={busy}>
                  {busy ? "시나리오를 준비하는 중…" : "금융 위기 모드로 확정"}
                </button>
              </>
            )}
            {error && (
              <p role="alert" className="event-error">
                {error}
              </p>
            )}
          </form>
        )
      )}
    </section>
  );
}
