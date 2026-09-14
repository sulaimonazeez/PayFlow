import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownLeft, Inbox, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useWalletStore } from "@/store/useWalletStore";
import {
  CATEGORY_ICONS,
  STATUS_BADGE_STYLES,
  STATUS_LABELS,
  groupTransactionsByDate,
} from "@/lib/transactionMeta";
import { currency } from "@/lib/currency";
import { transactionDetailPath } from "@/lib/routes";
import type { Transaction } from "@/types/transaction";

type FilterKey = "all" | "credit" | "debit" | "pending" | "failed";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "credit", label: "Money in" },
  { key: "debit", label: "Money out" },
  { key: "pending", label: "Pending" },
  { key: "failed", label: "Failed" },
];

function matchesFilter(txn: Transaction, filter: FilterKey) {
  switch (filter) {
    case "credit":
      return txn.type === "credit";
    case "debit":
      return txn.type === "debit";
    case "pending":
      return txn.status === "pending";
    case "failed":
      return txn.status === "failed";
    default:
      return true;
  }
}

function matchesQuery(txn: Transaction, query: string) {
  if (!query.trim()) return true;
  const haystack = `${txn.title} ${txn.subtitle ?? ""} ${txn.id}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="h-10 w-10 animate-pulse rounded-full bg-surface-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 animate-pulse rounded bg-surface-muted" />
        <div className="h-3 w-40 animate-pulse rounded bg-surface-muted" />
      </div>
      <div className="space-y-2 text-right">
        <div className="ml-auto h-3.5 w-16 animate-pulse rounded bg-surface-muted" />
        <div className="ml-auto h-3 w-12 animate-pulse rounded bg-surface-muted" />
      </div>
    </div>
  );
}

export default function Transactions() {
  const transactions = useWalletStore((s) => s.transactions);
  const hydrate = useWalletStore((s) => s.hydrate);

  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    let active = true;
    Promise.resolve(hydrate()).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [hydrate]);

  const filtered = useMemo(
    () => transactions.filter((txn) => matchesFilter(txn, filter) && matchesQuery(txn, query)),
    [transactions, filter, query]
  );

  const groups = useMemo(() => groupTransactionsByDate(filtered), [filtered]);

  return (
    <div>
      <PageHeader title="Transactions" description="Every payment and transfer on your wallet." />

      <div className="relative mt-4">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or reference"
          className="w-full rounded-card border border-surface-border bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active ? "bg-primary text-white" : "bg-surface-muted text-ink/60"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="mt-4 divide-y divide-surface-border rounded-card bg-surface shadow-card">
          <TransactionRowSkeleton />
          <TransactionRowSkeleton />
          <TransactionRowSkeleton />
        </div>
      ) : groups.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-card border border-dashed border-surface-border p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-ink/40">
            <Inbox size={20} />
          </span>
          <p className="mt-3 text-sm font-medium text-ink">
            {query || filter !== "all" ? "No matching transactions" : "No transactions yet"}
          </p>
          <p className="mt-1 text-xs text-ink/40">
            {query || filter !== "all"
              ? "Try a different search term or filter."
              : "Your payments and transfers will show up here."}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-1 text-xs font-medium text-ink/40">{group.label}</p>
              <div className="divide-y divide-surface-border rounded-card bg-surface shadow-card">
                {group.items.map((txn) => {
                  const Icon = txn.type === "credit" ? ArrowDownLeft : CATEGORY_ICONS[txn.category];
                  return (
                    <Link
                      key={txn.id}
                      to={transactionDetailPath(txn.id)}
                      className="flex items-center gap-3 p-4"
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          txn.type === "credit" ? "bg-success/10 text-success" : "bg-surface-muted text-primary"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{txn.title}</p>
                        <p className="truncate text-xs text-ink/50">
                          {txn.subtitle ? `${txn.subtitle} • ` : ""}
                          {new Date(txn.date).toLocaleTimeString("en-NG", { timeStyle: "short" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${txn.type === "credit" ? "text-success" : "text-ink"}`}>
                          {txn.type === "credit" ? "+" : "-"}
                          {currency.format(txn.amount)}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE_STYLES[txn.status]}`}
                        >
                          {STATUS_LABELS[txn.status]}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
