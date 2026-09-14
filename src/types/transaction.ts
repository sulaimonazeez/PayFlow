export type TransactionType = "credit" | "debit";
export type TransactionStatus = "successful" | "pending" | "failed";
export type TransactionCategory =
  | "transfer"
  | "airtime"
  | "data"
  | "electricity"
  | "cable"
  | "funding";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  title: string;
  subtitle?: string;
  amount: number;
  status: TransactionStatus;
  date: string;
}
