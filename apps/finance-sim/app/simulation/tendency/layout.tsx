import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "투자 성향 분석",
};

export default function TendencyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
