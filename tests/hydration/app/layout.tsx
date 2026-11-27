import Providers from "../../../apps/admin/app/providers";
export const metadata = { icons: { icon: "data:," } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
