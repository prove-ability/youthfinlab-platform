import type { Metadata } from "next";
import { BRAND, brandOpenGraph } from "@/lib/brand";
export const metadata: Metadata = {
  title: "인재채용 | 유스핀랩",
  alternates: { canonical: BRAND.url + "/recruit" },
  openGraph: {
    ...brandOpenGraph,
    title: "인재채용 | 유스핀랩",
    url: BRAND.url + "/recruit",
    images: [BRAND.image],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
