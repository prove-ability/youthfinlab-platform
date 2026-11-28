import type { Metadata } from "next";
import { BRAND, brandOpenGraph } from "@/lib/brand";
export const metadata: Metadata = {
  title: "재무상담 | 유스핀랩",
  alternates: { canonical: BRAND.url + "/financial-consulting" },
  openGraph: {
    ...brandOpenGraph,
    title: "재무상담 | 유스핀랩",
    url: BRAND.url + "/financial-consulting",
    images: [BRAND.image],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
