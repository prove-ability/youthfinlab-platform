import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기본 정보 입력",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
