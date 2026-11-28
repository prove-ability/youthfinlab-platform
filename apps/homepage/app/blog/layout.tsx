import type { Metadata } from "next";
import { BRAND, brandOpenGraph } from "@/lib/brand";
export const metadata: Metadata = {
  title: "블로그 | 유스핀랩",
  alternates: { canonical: BRAND.url + "/blog" },
  openGraph: {
    ...brandOpenGraph,
    title: "블로그 | 유스핀랩",
    url: BRAND.url + "/blog",
    images: [BRAND.image],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
