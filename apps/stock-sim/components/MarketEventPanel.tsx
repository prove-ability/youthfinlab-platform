"use client";
import { useState, useId } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getStudentMarketScenario,
  saveMarketDecision,
} from "@/actions/marketScenario";
import {
  exposureLabels,
  reasonLabels,
  type StudentMarketView,
  type DecisionReason,
} from "@repo/db/market-scenario";
import "@repo/ui/market-event.css";

export default function MarketEventPanel() {
  const query = useQuery({
    queryKey: ["student-market-scenario"],
    queryFn: getStudentMarketScenario,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
  if (query.isError && !query.data)
    return (
      <section className="market-event">
        <p role="alert">시장 속보를 확인하지 못했습니다.</p>
        <button
          type="button"
          disabled={query.isFetching}
          onClick={() => query.refetch()}
        >
          다시 불러오기
        </button>
      </section>
    );
  if (!query.data) return null;
  return (
    <>
      {query.isError && (
        <div className="market-event">
          <p role="alert">
            속보 갱신에 실패했습니다. 작성 중인 이유는 유지됩니다.
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
      <MarketEventView
        key={query.data.day}
        data={query.data}
        onSave={saveMarketDecision}
        onRefresh={() => query.refetch()}
      />
    </>
  );
}

export function MarketEventView({
  data,
  onSave,
  onRefresh,
}: {
  data: StudentMarketView;
  onSave: (input: {
    day: number;
    reason: DecisionReason;
    note: string;
  }) => Promise<unknown>;
  onRefresh: () => Promise<unknown>;
}) {
  const id = useId();
  const [reason, setReason] = useState<DecisionReason | "">(
    data.decision?.reason ?? "",
  );
  const [note, setNote] = useState(data.decision?.note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <section className="market-event" aria-labelledby={`${id}-heading`}>
      <div className="event-meta">
        <p className="event-kicker">가상 시장 속보 · DAY {data.day}</p>
        <span className="event-tag">금융 위기 체험</span>
      </div>
      <h2 id={`${id}-heading`}>{data.bulletin.title}</h2>
      <div className="event-stack">
        <p>{data.bulletin.news}</p>
        <p className="event-muted">
          교육용 가상 시장입니다. 실제 기업의 전망이나 투자 권유가 아닙니다.
        </p>
      </div>
      <details className="event-rule">
        <summary>이번 수업의 기업 특성</summary>
        <div className="event-tags">
          {data.stocks.map((s) => (
            <span className="event-tag" key={s.stockId}>
              {s.name} · {exposureLabels[s.exposure]}
            </span>
          ))}
        </div>
        <p className="event-muted">
          차입 의존형은 외부에서 빌리는 돈의 비중이 크고, 생활 수요형은 일상에
          필요한 상품 수요가 꾸준하다고 가정합니다. 균형형은 그 중간입니다. 어떤
          기업도 손실이 없다고 보장할 수 없습니다.
        </p>
      </details>
      {data.canDecide ? (
        <form
          className="event-rule"
          aria-labelledby={`${id}-reason`}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!reason || busy) return;
            setBusy(true);
            setError("");
            setSaved(false);
            try {
              await onSave({ day: data.day, reason, note });
              setSaved(true);
              await onRefresh();
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
            <legend id={`${id}-reason`}>
              이번 Day, 어떻게 판단했나요? (필수 선택)
            </legend>
            <p className="event-muted">
              이유 기록은 주문이 아닙니다. 실제 매수·매도는 투자 화면에서
              하세요. 이유에 정답 점수는 없으며 수익률 순위에 반영되지 않습니다.
            </p>
            <div className="event-stack">
              {Object.entries(reasonLabels).map(([value, label]) => (
                <label className="event-choice" key={value}>
                  <input
                    type="radio"
                    name="reason"
                    value={value}
                    required
                    checked={reason === value}
                    onChange={() => {
                      setReason(value as DecisionReason);
                      setSaved(false);
                    }}
                  />
                  {label}
                </label>
              ))}
              <label htmlFor={`${id}-note`}>
                조금 더 설명하기 (선택 · 500자 이내)
              </label>
              <textarea
                id={`${id}-note`}
                name="note"
                maxLength={500}
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setSaved(false);
                }}
                aria-describedby={`${id}-privacy`}
              />
              <p id={`${id}-privacy`} className="event-muted">
                선생님이 함께 읽는 기록입니다. 연락처 등 개인정보는 적지 마세요.
                현재 Day 동안 수정할 수 있습니다.
              </p>
              <div className="event-actions">
                <button type="submit" disabled={busy}>
                  {busy ? "이유를 저장하는 중…" : "선택 이유 저장"}
                </button>
                {saved && <p role="status">선택 이유를 저장했어요.</p>}
              </div>
              {error && (
                <>
                  <p role="alert" className="event-error">
                    {error}
                  </p>
                  <button type="button" onClick={() => onRefresh()}>
                    현재 Day 다시 확인
                  </button>
                </>
              )}
            </div>
          </fieldset>
        </form>
      ) : (
        <p className="event-rule">
          {data.day === data.totalDays
            ? "거래를 마쳤습니다. 수익률과 함께 선택의 과정을 돌아보세요."
            : "수업이 종료되어 이유 기록을 마감했습니다."}
        </p>
      )}
      {data.history.length > 0 && (
        <div className="event-rule">
          <h3>선택과 결과 돌아보기</h3>
          <p className="event-muted">
            다음 Day가 되면 당시의 선택과 결과를 함께 보여줍니다. 결과만으로
            좋은 판단인지 단정하지 않아요.
          </p>
          {[...data.history].reverse().map((h) => (
            <details
              key={h.day}
              className="event-history"
              open={h.day === data.day - 1}
            >
              <summary>
                Day {h.day} → {h.day + 1} · {h.title}
              </summary>
              <p>
                <strong>내가 남긴 이유</strong>
                <br />
                {h.decision
                  ? reasonLabels[h.decision.reason]
                  : "이 Day에는 이유를 남기지 않았어요."}
                {h.decision?.note && (
                  <>
                    <br />
                    {h.decision.note}
                  </>
                )}
              </p>
              <p>{h.explanation}</p>
              <div className="event-tags">
                {h.changes.map((c) => (
                  <span key={c.name} className="event-tag">
                    {c.name} {c.percent > 0 ? "+" : ""}
                    {c.percent}%
                  </span>
                ))}
              </div>
              <p className="event-muted">
                그때 알았던 정보로 다시 판단한다면 무엇을 확인하고 싶나요?
              </p>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
