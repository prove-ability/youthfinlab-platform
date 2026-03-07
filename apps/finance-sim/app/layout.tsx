import type { Metadata, Viewport } from "next";
import QueryProvider from "@/contexts/QueryProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2F4538",
};

export const metadata: Metadata = {
  title: "유스핀랩 | 재무 시뮬레이션",
  description: "청년 재무 시뮬레이션 프로그램",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-stone-100">
        <QueryProvider>
          <ToastProvider>
            <div className="mx-auto max-w-xl min-h-dvh bg-white shadow-sm">
              {children}
            </div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
