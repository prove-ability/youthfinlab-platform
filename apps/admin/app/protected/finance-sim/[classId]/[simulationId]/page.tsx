import { getStudentSimulation } from "@/actions/financeSimActions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudentReportView } from "./components/student-report-view";

interface PageProps {
  params: Promise<{ classId: string; simulationId: string }>;
}

export default async function StudentSimulationPage({ params }: PageProps) {
  const { classId, simulationId } = await params;
  const simulation = await getStudentSimulation(simulationId);

  if (!simulation || simulation.classId !== classId) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link
          href="/protected/finance-sim"
          className="hover:text-foreground transition-colors"
        >
          재무 시뮬레이션
        </Link>
        <span>/</span>
        <Link
          href={`/protected/finance-sim/${classId}`}
          className="hover:text-foreground transition-colors"
        >
          {simulation.class?.name || "클래스"}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          {simulation.guest?.name || "학생"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {simulation.guest?.name || "학생"}의 재무 리포트
          </h1>
          <p className="text-sm text-muted-foreground">
            시뮬레이션 결과를 종합한 개별 리포트입니다.
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            simulation.completedAt
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {simulation.completedAt
            ? "완료"
            : `${simulation.currentStep}/6단계 진행중`}
        </span>
      </div>

      <StudentReportView simulation={simulation} />
    </div>
  );
}
