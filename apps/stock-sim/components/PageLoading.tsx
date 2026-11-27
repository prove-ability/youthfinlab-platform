import { LoadingState } from "@repo/ui/async-state";
export default function PageLoading({
  label = "화면을 불러오는 중…",
}: {
  label?: string;
}) {
  return (
    <div className="min-h-screen bg-white pb-20">
      <LoadingState label={label} />
    </div>
  );
}
