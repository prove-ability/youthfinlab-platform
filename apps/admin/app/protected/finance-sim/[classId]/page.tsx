import {
  getClassSimulationSummary,
  getClassSimulationDetails,
} from "@/actions/financeSimActions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResultsDashboard } from "./components/results-dashboard";

interface PageProps {
  params: Promise<{ classId: string }>;
}

export default async function FinanceSimClassDetailPage({ params }: PageProps) {
  const { classId } = await params;
  const [summaryResult, detailsResult] = await Promise.all([
    getClassSimulationSummary(classId),
    getClassSimulationDetails(classId),
  ]);

  if ("success" in summaryResult || "success" in detailsResult) {
    redirect("/login");
  }

  const summary = summaryResult;
  const details = detailsResult;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link
          href="/protected/finance-sim"
          className="hover:text-foreground transition-colors"
        >
          재무 시뮬레이션
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          {summary.classData.name}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{summary.classData.name}</h1>
          <p className="text-sm text-muted-foreground">
            {summary.classData.client?.name} · {summary.classData.manager?.name}{" "}
            · 코드: {summary.classData.code}
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            summary.classData.status === "active"
              ? "bg-green-100 text-green-700"
              : summary.classData.status === "ended"
                ? "bg-gray-100 text-gray-600"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {summary.classData.status === "active"
            ? "진행중"
            : summary.classData.status === "ended"
              ? "종료"
              : "설정중"}
        </span>
      </div>

      <ResultsDashboard summary={summary} details={details} classId={classId} />
    </div>
  );
}
