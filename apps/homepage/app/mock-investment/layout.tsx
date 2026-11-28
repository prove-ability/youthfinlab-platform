import type { Metadata } from "next";
import { BRAND, brandOpenGraph } from "@/lib/brand";
export const metadata: Metadata = {
  title: "모의투자체험 | 유스핀랩",
  alternates: { canonical: BRAND.url + "/mock-investment" },
  openGraph: {
    ...brandOpenGraph,
    title: "모의투자체험 | 유스핀랩",
    url: BRAND.url + "/mock-investment",
    images: [BRAND.image],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
