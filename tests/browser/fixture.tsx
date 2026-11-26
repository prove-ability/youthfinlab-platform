import Onboarding from "../../apps/stock-sim/app/onboarding/page";
import SeedData from "../../apps/admin/app/protected/seed-data/page";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { QRDisplayModal } from "../../apps/admin/app/protected/classes/components/qr-display-modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClassList } from "../../apps/admin/app/protected/classes/components/class-list";
const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
function Fixture() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <QueryClientProvider client={client}>
        <ClassList />
      </QueryClientProvider>
      <button onClick={() => setOpen(true)}>QR 열기</button>
      <QRDisplayModal
        isOpen={open}
        setIsOpen={setOpen}
        classId="fixture"
        className="테스트 수업"
        programType="stock_game"
      />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  location.search === "?seed" ? (
    <SeedData />
  ) : location.search === "?onboarding" ? (
    <Onboarding />
  ) : (
    <Fixture />
  ),
);
