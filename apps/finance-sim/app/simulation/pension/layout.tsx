import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연금 준비 시뮬레이션",
};

export default function PensionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
