import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { PRIMARY_NAV } from "@/lib/navigation";

/**
 * Fixed bottom tab bar, visible below the lg breakpoint. Mirrors the
 * sidebar's primary nav so the two stay in sync automatically.
 */
export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 flex lg:hidden border-t border-surface-border bg-surface pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      {PRIMARY_NAV.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            clsx(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-ink/50",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.25 : 2} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
