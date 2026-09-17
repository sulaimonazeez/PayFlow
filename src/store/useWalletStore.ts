import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Transaction,
  TransactionType,
  TransactionCategory,
  TransactionStatus,
} from "@/types/transaction";
import { transactionService } from "@/services/transactionService";

const STARTING_BALANCE = 404500;

interface NewTransactionInput {
  type: TransactionType;
  category: TransactionCategory;
  title: string;
  subtitle?: string;
  amount: number;
  status?: TransactionStatus;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addTransaction: (input: NewTransactionInput) => void;
}

function applyDelta(balance: number, type: TransactionType, amount: number) {
  return type === "credit" ? balance + amount : balance - amount;
}

/**
 * All-numeric reference, same shape as transactionService's seed data:
 * millisecond timestamp (13 digits) + random 6-digit suffix.
 * Keeping this in sync with transactionService.ts so every reference
 * in the app — seeded or user-generated — looks consistent.
 */
function generateReference(): string {
  const timePart = Date.now().toString();
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
  return `${timePart}${randomPart}`;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: STARTING_BALANCE,
      transactions: [],
      hydrated: false,

      hydrate: async () => {
        if (get().hydrated) return;
        const seed = await transactionService.listTransactions();
        const balance = seed.reduce(
          (sum, t) => applyDelta(sum, t.type, t.amount),
          STARTING_BALANCE,
        );
        set({ transactions: seed, balance, hydrated: true });
      },

      addTransaction: (input) => {
        const transaction: Transaction = {
          id: generateReference(),
          status: input.status ?? "successful",
          date: new Date().toISOString(),
          ...input,
        };
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          balance: applyDelta(state.balance, transaction.type, transaction.amount),
        }));
      },
    }),
    { name: "payflow-wallet" },
  ),
);
