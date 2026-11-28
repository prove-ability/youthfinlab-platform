import type { Metadata } from "next";
import { BRAND, brandOpenGraph } from "@/lib/brand";
export const metadata: Metadata = {
  title: "고객지원 | 유스핀랩",
  alternates: { canonical: BRAND.url + "/customer-support" },
  openGraph: {
    ...brandOpenGraph,
    title: "고객지원 | 유스핀랩",
    url: BRAND.url + "/customer-support",
    images: [BRAND.image],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
