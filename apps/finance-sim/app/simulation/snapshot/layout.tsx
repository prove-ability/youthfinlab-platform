import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "재무 상태 요약",
};

export default function SnapshotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
