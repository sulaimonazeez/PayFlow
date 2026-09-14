import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { currency } from "@/lib/currency";

interface WalletBalanceCardProps {
  balance: number;
  accountId: string;
}

export default function WalletBalanceCard({ balance, accountId }: WalletBalanceCardProps) {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="rounded-card bg-primary p-6 text-white shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/70">Available balance</span>
        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          className="text-white/70 hover:text-white"
          aria-label={hidden ? "Show balance" : "Hide balance"}
        >
          {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
        {hidden ? "₦ • • • • • •" : currency.format(balance)}
      </p>

      <p className="mt-1 text-xs text-white/50">{accountId}</p>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          className="rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
        >
          Fund wallet
        </button>
        <button
          type="button"
          className="rounded-pill bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
        >
          Transfer
        </button>
      </div>
    </div>
  );
}
