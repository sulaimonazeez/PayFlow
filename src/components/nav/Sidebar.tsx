import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/lib/navigation";

/**
 * Fixed left sidebar, visible from the lg breakpoint up. Below lg the
 * BottomNav takes over — see AppLayout for the breakpoint switch.
 */
export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:border-r lg:border-surface-border lg:bg-surface lg:h-screen lg:sticky lg:top-0">
      <div className="px-6 pt-8 pb-6">
        <span className="font-display text-xl font-semibold text-primary">PayFlow</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {PRIMARY_NAV.map((item) => (
          <SidebarLink key={item.path} {...item} />
        ))}
      </nav>

      <div className="px-3 pb-6 space-y-1 border-t border-surface-border pt-3">
        {SECONDARY_NAV.map((item) => (
          <SidebarLink key={item.path} {...item} />
        ))}
      </div>
    </aside>
  );
}

function SidebarLink({ label, path, icon: Icon }: (typeof PRIMARY_NAV)[number]) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-white"
            : "text-ink/70 hover:bg-surface-muted hover:text-ink",
        )
      }
    >
      <Icon size={18} strokeWidth={2} />
      {label}
    </NavLink>
  );
}
