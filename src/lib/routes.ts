/**
 * Central route registry. Import ROUTES instead of hardcoding path strings
 * so route changes only happen in one place.
 */
export const ROUTES = {
  login: "/login",
  register: "/register",
  verify: "/verify",
  createPin: "/create-pin",

  dashboard: "/",
  wallet: "/wallet",
  transfer: "/transfer",
  airtime: "/airtime",
  data: "/data",
  electricity: "/electricity",
  cable: "/cable",
  transactions: "/transactions",
  transactionDetail: "/transactions/:id",
  rewards: "/rewards",
  notifications: "/notifications",
  profile: "/profile",
  settings: "/settings",
} as const;

export function transactionDetailPath(id: string) {
  return `/transactions/${id}`;
}
