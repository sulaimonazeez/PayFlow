import type { Transaction } from "@/types/transaction";

/**
 * Generates an all-numeric reference in the shape real payment
 * processors use: a millisecond timestamp (13 digits, so refs sort
 * chronologically and never collide within the same session) plus a
 * random 6-digit suffix. e.g. "1757861234567834209"
 */
function generateReference(): string {
  const timePart = Date.now().toString();
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
  return `${timePart}${randomPart}`;
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: generateReference(),
    type: "debit",
    category: "transfer",
    title: "Transfer",
    subtitle: "To Wosilat Olorunishola",
    amount: 750000,
    status: "successful",
    date: hoursAgo(1),
  },
  {
    id: generateReference(),
    type: "debit",
    category: "transfer",
    title: "Transfer",
    subtitle: "To Emmanuel Sunday Gbega",
    amount: 250000,
    status: "successful",
    date: hoursAgo(2),
  },
  {
    id: generateReference(),
    type: "debit",
    category: "transfer",
    title: "Transfer",
    subtitle: "To Lateefat Biola Olarewaju",
    amount: 5000,
    status: "pending",
    date: "2026-09-17T18:25:00.000-04:00",
  },
  {
    id: generateReference(),
    type: "credit",
    category: "transfer",
    title: "Transfer received",
    subtitle: "From Ibrahim Adeyemi",
    amount: 620000,
    status: "successful",
    date: "2026-09-14T10:00:00.000Z",
  },
  {
    id: generateReference(),
    type: "debit",
    category: "airtime",
    title: "Airtime purchase",
    subtitle: "MTN • 08031234567",
    amount: 2000,
    status: "successful",
    date: hoursAgo(4),
  },
  {
    id: generateReference(),
    type: "debit",
    category: "data",
    title: "Data bundle",
    subtitle: "Airtel • 3GB Monthly",
    amount: 1500,
    status: "pending",
    date: hoursAgo(26),
  },
  {
    id: generateReference(),
    type: "debit",
    category: "electricity",
    title: "Electricity bill",
    subtitle: "EKEDC • Prepaid meter - token: 4085-9034-7463-8463-3443",
    amount: 2000,
    status: "successful",
    date: hoursAgo(30),
  },
  {
    id: generateReference(),
    type: "debit",
    category: "cable",
    title: "Cable subscription",
    subtitle: "DStv • Compact bouquet",
    amount: 19000,
    status: "failed",
    date: hoursAgo(72),
  },
  {
    id: generateReference(),
    type: "credit",
    category: "funding",
    title: "Wallet funding",
    subtitle: "Bank transfer • GTBank",
    amount: 50000,
    status: "successful",
    date: hoursAgo(96),
  },
];

/**
 * Mock transaction service. Shaped like a real REST client
 * (`listTransactions`) so it can be swapped for actual API calls later
 * without touching the store or components that use it.
 */
export const transactionService = {
  async listTransactions(): Promise<Transaction[]> {
    return SEED_TRANSACTIONS;
  },
};
