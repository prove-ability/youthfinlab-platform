import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "저축 vs 투자 시뮬레이션",
};

export default function InvestmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
