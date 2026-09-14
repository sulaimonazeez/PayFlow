import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  ArrowLeftRight,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Transaction, TransactionCategory, TransactionStatus } from "@/types/transaction";

export const CATEGORY_ICONS: Record<TransactionCategory, LucideIcon> = {
  transfer: ArrowLeftRight,
  airtime: Smartphone,
  data: Wifi,
  electricity: Zap,
  cable: Tv,
  funding: Wallet,
};

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  transfer: "Transfer",
  airtime: "Airtime",
  data: "Data",
  electricity: "Electricity",
  cable: "Cable TV",
  funding: "Funding",
};

export const STATUS_LABELS: Record<TransactionStatus, string> = {
  successful: "Successful",
  pending: "Pending",
  failed: "Failed",
};

// Text-only status color, used on the detail page's large status line.
export const STATUS_STYLES: Record<TransactionStatus, string> = {
  successful: "text-success",
  pending: "text-warning",
  failed: "text-danger",
};

// Same three status colors, but as a tinted badge (bg + text), reusing the
// exact bg-success/10 + text-success pairing already used for the credit
// icon circle — no new colors introduced.
export const STATUS_BADGE_STYLES: Record<TransactionStatus, string> = {
  successful: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-danger/10 text-danger",
};

export type DateGroup = {
  label: string;
  items: Transaction[];
};

/**
 * Groups transactions into "Today", "Yesterday", then calendar-date
 * buckets (newest first). Assumes `transactions` may be in any order —
 * sorts defensively before grouping.
 */
export function groupTransactionsByDate(transactions: Transaction[]): DateGroup[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const labelFor = (raw: string) => {
    const d = new Date(raw);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) return "Today";
    if (d.getTime() === yesterday.getTime()) return "Yesterday";
    return d.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  };

  const order: string[] = [];
  const map = new Map<string, Transaction[]>();

  for (const txn of sorted) {
    const label = labelFor(txn.date);
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(txn);
  }

  return order.map((label) => ({ label, items: map.get(label)! }));
}
