import { BRAND } from "@/lib/brand";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import RootProvider from "@/components/Providers/RootProvider";

export const metadata: Metadata = {
  title: "유스핀랩 | 금융교육 전문기업",
  description:
    "금융교육 전문기업 유스핀랩은 청소년, 청년, 일반인을 위한 맞춤형 금융교육 프로그램을 제공합니다. 체계적인 커리큘럼과 전문 강사진이 함께합니다.",
  metadataBase: new URL("https://www.youthfinlab.com"),
  openGraph: {
    title: "유스핀랩 | 금융교육 전문기업",
    description:
      "금융교육 전문기업 유스핀랩은 청소년, 청년, 일반인을 위한 맞춤형 금융교육 프로그램을 제공합니다. 체계적인 커리큘럼과 전문 강사진이 함께합니다.",
    url: "https://www.youthfinlab.com",
    siteName: "유스핀랩",
    locale: "ko_KR",
    type: "website",
    images: [{ url: BRAND.image, width: 1200, height: 630, alt: BRAND.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: "유스핀랩 - 금융교육 전문기업",
    description:
      "금융지식이 만드는 큰 변화, 금융교육 전문기업 유스핀랩과 함께하세요",
    images: [BRAND.image],
  },
  icons: {
    icon: [
      // SVG를 먼저 둬 최신 브라우저가 이걸 쓰게 한다. 아래 ICO/PNG는 구형 폴백.
      // sizes를 any로 주지 않으면 크롬이 크기가 명시된 아래 PNG를 골라버린다.
      {
        url: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        url: "/favicon.ico",
        sizes: "32x32",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "YDyhHr3hzO0Rs8E_09MgiQdjOPV3dTXZWsr3ZCC1vyY",
    other: {
      "naver-site-verification": "3fb974f582181fc4f8ea7e7afd66cb97bdaa3432",
    },
  },
};

export const viewport: Viewport = { themeColor: "#1A1D23" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          본문 바로가기
        </a>
        <RootProvider>
          <Header />
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
}
