import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR 로그인",
};

export default function QRLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
