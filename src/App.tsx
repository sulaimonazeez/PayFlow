import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import RequireAuth from "@/components/RequireAuth";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import { ROUTES } from "@/lib/routes";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Verify from "@/pages/auth/Verify";
import CreatePin from "@/pages/auth/CreatePin";

import Dashboard from "@/pages/app/Dashboard";
import Wallet from "@/pages/app/Wallet";
import Transfer from "@/pages/app/Transfer";
import Airtime from "@/pages/app/Airtime";
import Data from "@/pages/app/Data";
import Electricity from "@/pages/app/Electricity";
import Cable from "@/pages/app/Cable";
import Transactions from "@/pages/app/Transactions";
import TransactionDetail from "@/pages/app/TransactionDetail";
import Rewards from "@/pages/app/Rewards";
import Notifications from "@/pages/app/Notifications";
import Profile from "@/pages/app/Profile";
import Settings from "@/pages/app/Settings";

import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.register} element={<Register />} />
          <Route path={ROUTES.verify} element={<Verify />} />
          <Route path={ROUTES.createPin} element={<CreatePin />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.dashboard} element={<Dashboard />} />
            <Route path={ROUTES.wallet} element={<Wallet />} />
            <Route path={ROUTES.transfer} element={<Transfer />} />
            <Route path={ROUTES.airtime} element={<Airtime />} />
            <Route path={ROUTES.data} element={<Data />} />
            <Route path={ROUTES.electricity} element={<Electricity />} />
            <Route path={ROUTES.cable} element={<Cable />} />
            <Route path={ROUTES.transactions} element={<Transactions />} />
            <Route path={ROUTES.transactionDetail} element={<TransactionDetail />} />
            <Route path={ROUTES.rewards} element={<Rewards />} />
            <Route path={ROUTES.notifications} element={<Notifications />} />
            <Route path={ROUTES.profile} element={<Profile />} />
            <Route path={ROUTES.settings} element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
