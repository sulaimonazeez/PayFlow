import { Outlet } from "react-router-dom";

/**
 * Full-bleed centered layout used by the unauthenticated flow. No nav
 * chrome — just the brand mark and the current step's content.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-muted px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-semibold text-primary">PayFlow</span>
        </div>
        <div className="rounded-card bg-surface p-6 shadow-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
