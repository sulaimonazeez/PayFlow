import { useEffect } from "react";
import { Smartphone, Wifi, Zap, Tv, ArrowLeftRight, Wallet, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";
import WalletBalanceCard from "@/components/ui/WalletBalanceCard";
import { ROUTES, transactionDetailPath } from "@/lib/routes";
import { useWalletStore } from "@/store/useWalletStore";
import { CATEGORY_ICONS, STATUS_LABELS, STATUS_STYLES } from "@/lib/transactionMeta";
import { currency } from "@/lib/currency";

const QUICK_ACTIONS = [
  { label: "Airtime", path: ROUTES.airtime, icon: Smartphone },
  { label: "Data", path: ROUTES.data, icon: Wifi },
  { label: "Electricity", path: ROUTES.electricity, icon: Zap },
  { label: "Cable TV", path: ROUTES.cable, icon: Tv },
  { label: "Transfer", path: ROUTES.transfer, icon: ArrowLeftRight },
  { label: "Fund wallet", path: ROUTES.wallet, icon: Wallet },
];

export default function Dashboard() {
  const balance = useWalletStore((s) => s.balance);
  const transactions = useWalletStore((s) => s.transactions);
  const hydrate = useWalletStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const recent = transactions.slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-ink/50">Good afternoon,</p>
        <h1 className="font-display text-xl font-semibold text-ink">Sulaimon 👋</h1>
      </div>

      <WalletBalanceCard balance={balance} accountId="PayFlow • 8012345678" />

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {QUICK_ACTIONS.map(({ label, path, icon: Icon }) => (
          <Link
            key={label}
            to={path}
            className="flex flex-col items-center gap-2 rounded-card bg-surface p-3 text-center shadow-card transition-transform hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-primary">
              <Icon size={18} />
            </span>
            <span className="text-xs font-medium text-ink/70">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Recent transactions</h2>
          <Link to={ROUTES.transactions} className="text-sm font-medium text-primary">
            See all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-card border border-dashed border-surface-border p-8 text-center text-sm text-ink/40">
            No transactions yet.
          </div>
        ) : (
          <div className="divide-y divide-surface-border rounded-card bg-surface shadow-card">
            {recent.map((txn) => {
              const Icon = txn.type === "credit" ? ArrowDownLeft : CATEGORY_ICONS[txn.category];
              return (
                <Link key={txn.id} to={transactionDetailPath(txn.id)} className="flex items-center gap-3 p-4">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      txn.type === "credit" ? "bg-success/10 text-success" : "bg-surface-muted text-primary"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{txn.title}</p>
                    <p className="text-xs text-ink/50">
                      {txn.subtitle ? `${txn.subtitle} • ` : ""}
                      {new Date(txn.date).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${txn.type === "credit" ? "text-success" : "text-ink"}`}>
                      {txn.type === "credit" ? "+" : "-"}
                      {currency.format(txn.amount)}
                    </p>
                    <p className={`text-xs ${STATUS_STYLES[txn.status]}`}>{STATUS_LABELS[txn.status]}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
