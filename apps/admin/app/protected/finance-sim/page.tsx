import { getFinanceSimClasses } from "@/actions/financeSimActions";
import Link from "next/link";

export default async function FinanceSimPage() {
  const classes = await getFinanceSimClasses();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">재무 시뮬레이션</h1>
          <p className="text-sm text-muted-foreground">
            재무 시뮬레이션 프로그램 수업을 관리합니다.
          </p>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">
            아직 재무 시뮬레이션 수업이 없습니다
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            클래스 관리에서 프로그램 유형을 &quot;재무 시뮬레이션&quot;으로 선택하여
            새 수업을 만들어주세요.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => {
            const completionRate =
              cls.studentCount > 0
                ? Math.round((cls.completedCount / Number(cls.studentCount)) * 100)
                : 0;

            return (
              <Link
                key={cls.id}
                href={`/protected/finance-sim/${cls.id}`}
                className="group rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                    {cls.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      cls.status === "active"
                        ? "bg-green-100 text-green-700"
                        : cls.status === "ended"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {cls.status === "active"
                      ? "진행중"
                      : cls.status === "ended"
                        ? "종료"
                        : "설정중"}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  <p>
                    {cls.client?.name} · {cls.manager?.name}
                  </p>
                  <p>수업 코드: {cls.code}</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">학생</span>{" "}
                    <span className="font-semibold">{String(cls.studentCount)}명</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">완료</span>{" "}
                    <span className="font-semibold text-blue-600">
                      {String(cls.completedCount)}명
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">완료율</span>{" "}
                    <span className="font-semibold">{completionRate}%</span>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
