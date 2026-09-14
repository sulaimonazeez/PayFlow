import { Outlet } from "react-router-dom";
import Sidebar from "@/components/nav/Sidebar";
import BottomNav from "@/components/nav/BottomNav";

/**
 * Shell for all authenticated pages. Sidebar (desktop) and BottomNav
 * (mobile) render the same PRIMARY_NAV, so adding a route only means
 * editing lib/navigation.ts once.
 */
export default function AppLayout() {
  return (
    <div className="lg:flex lg:min-h-screen">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <main className="mx-auto max-w-2xl px-4 pt-6 pb-24 lg:max-w-3xl lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
