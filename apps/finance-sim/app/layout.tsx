import type { Metadata, Viewport } from "next";
import QueryProvider from "@/contexts/QueryProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

const APP_NAME = "재무 시뮬레이션";
const APP_DESCRIPTION =
  "나의 수입·지출·자산을 입력하고 저축 vs 투자, 연금 준비, 투자 성향까지 한 번에 체험하는 청년 재무 시뮬레이션 프로그램";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2F4538",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FINANCE_SIM_APP_URL || "http://localhost:3200"
  ),

  title: {
    default: `유스핀랩 | ${APP_NAME}`,
    template: `%s | 유스핀랩 ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "재무 시뮬레이션",
    "청년 재무",
    "투자 성향 분석",
    "연금 시뮬레이션",
    "저축 vs 투자",
    "재무 교육",
    "유스핀랩",
  ],
  authors: [{ name: "유스핀랩" }],
  creator: "유스핀랩",
  publisher: "유스핀랩",

  // 검색 엔진 - 수업용 내부 서비스이므로 인덱싱 비허용
  robots: {
    index: false,
    follow: false,
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: `유스핀랩 ${APP_NAME}`,
    title: `유스핀랩 | ${APP_NAME}`,
    description: APP_DESCRIPTION,
  },

  // Apple Web App (홈 화면 추가)
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },

  // 기타
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
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
