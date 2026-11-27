import Providers from "../../../apps/admin/app/providers";
import "../../../apps/admin/app/globals.css";
import "../../../packages/ui/src/brand.css";
import "../../../apps/admin/app/protected/workspace.css";
import "../../../packages/ui/src/editorial.css";
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
