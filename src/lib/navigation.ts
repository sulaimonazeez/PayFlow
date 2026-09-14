import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Receipt,
  Gift,
  User,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

/** Primary nav — shown in both the bottom tab bar and the sidebar. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Wallet", path: ROUTES.wallet, icon: Wallet },
  { label: "Transfer", path: ROUTES.transfer, icon: ArrowLeftRight },
  { label: "History", path: ROUTES.transactions, icon: Receipt },
  { label: "Rewards", path: ROUTES.rewards, icon: Gift },
];

/** Extra links — sidebar only on desktop, reached via "More"/profile on mobile. */
export const SECONDARY_NAV: NavItem[] = [
  { label: "Profile", path: ROUTES.profile, icon: User },
];
