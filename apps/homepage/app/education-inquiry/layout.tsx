import type { Metadata } from "next";
import { BRAND, brandOpenGraph } from "@/lib/brand";
export const metadata: Metadata = {
  title: "교육문의 | 유스핀랩",
  alternates: { canonical: BRAND.url + "/education-inquiry" },
  openGraph: {
    ...brandOpenGraph,
    title: "교육문의 | 유스핀랩",
    url: BRAND.url + "/education-inquiry",
    images: [BRAND.image],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
