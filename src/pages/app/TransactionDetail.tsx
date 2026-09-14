import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowDownLeft, Check, Copy, Share2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useWalletStore } from "@/store/useWalletStore";
import { CATEGORY_ICONS, STATUS_BADGE_STYLES, STATUS_LABELS } from "@/lib/transactionMeta";
import { currency } from "@/lib/currency";
import { ROUTES } from "@/lib/routes";

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const transaction = useWalletStore((s) => s.transactions.find((t) => t.id === id));
  const [copied, setCopied] = useState(false);

  if (!transaction) {
    return (
      <div>
        <PageHeader title="Transaction detail" description={`Reference: ${id}`} />
        <div className="rounded-card border border-dashed border-surface-border p-8 text-center text-sm text-ink/40">
          We couldn't find that transaction.
        </div>
        <Link to={ROUTES.transactions} className="mt-4 inline-block text-sm font-medium text-primary">
          Back to transactions
        </Link>
      </div>
    );
  }

  const Icon = transaction.type === "credit" ? ArrowDownLeft : CATEGORY_ICONS[transaction.category];

  const receiptSummary = [
    transaction.title,
    transaction.subtitle,
    `${transaction.type === "credit" ? "+" : "-"}${currency.format(transaction.amount)}`,
    STATUS_LABELS[transaction.status],
    `Ref: ${transaction.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(transaction.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — no-op, button just won't confirm.
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Transaction receipt", text: receiptSummary });
      } catch {
        // User cancelled the share sheet — no-op.
      }
    } else {
      await handleCopyReference();
    }
  };

  return (
    <div>
      <PageHeader title="Transaction detail" description={`Reference: ${transaction.id}`} />

      <div className="rounded-card bg-surface p-6 text-center shadow-card">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            transaction.type === "credit" ? "bg-success/10 text-success" : "bg-surface-muted text-primary"
          }`}
        >
          <Icon size={24} />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-ink">
          {transaction.type === "credit" ? "+" : "-"}
          {currency.format(transaction.amount)}
        </p>
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_STYLES[transaction.status]}`}
        >
          {STATUS_LABELS[transaction.status]}
        </span>

        <div className="mt-5 flex justify-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full border border-surface-border px-3 py-1.5 text-xs font-medium text-ink/70"
          >
            <Share2 size={14} />
            Share receipt
          </button>
        </div>
      </div>

      <div className="mt-4 divide-y divide-surface-border rounded-card bg-surface shadow-card">
        <div className="flex items-center justify-between p-4">
          <span className="text-sm text-ink/50">Description</span>
          <span className="text-sm font-medium text-ink">{transaction.title}</span>
        </div>
        {transaction.subtitle && (
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-ink/50">Detail</span>
            <span className="text-sm font-medium text-ink">{transaction.subtitle}</span>
          </div>
        )}
        <div className="flex items-center justify-between p-4">
          <span className="text-sm text-ink/50">Date</span>
          <span className="text-sm font-medium text-ink">
            {new Date(transaction.date).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
          </span>
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="text-sm text-ink/50">Reference</span>
          <button
            type="button"
            onClick={handleCopyReference}
            className="flex items-center gap-1.5 text-sm font-medium text-ink"
          >
            {transaction.id}
            {copied ? (
              <Check size={14} className="text-success" />
            ) : (
              <Copy size={14} className="text-ink/40" />
            )}
          </button>
        </div>
      </div>

      <Link to={ROUTES.transactions} className="mt-4 inline-block text-sm font-medium text-primary">
        Back to transactions
      </Link>
    </div>
  );
}
