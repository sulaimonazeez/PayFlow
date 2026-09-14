# PayFlow

A responsive frontend-only fintech platform that simulates wallet management, transfers, airtime, data, electricity and cable payments using realistic transaction workflows, mock services and persistent local state.

**Status:** Phase 1 — Foundation (Vite/TypeScript/Tailwind setup, routing, theme, responsive layout). Feature flows are stubbed and land in later phases.

## Features

- [x] Responsive app shell (sidebar on desktop, bottom nav on mobile)
- [x] Route guard for authenticated pages
- [x] Global error boundary
- [ ] Auth flow (login, register, OTP, PIN) — Phase 2
- [ ] Dashboard with live wallet state — Phase 3
- [ ] Transaction engine & mock services — Phase 4
- [ ] Transfer / airtime / data / electricity / cable flows — Phase 5
- [ ] Rewards, notifications, profile, settings — Phase 6

## Tech Stack

React · TypeScript · Vite · Tailwind CSS · React Router · Zustand · React Hook Form · Zod · Lucide React

## Screenshots

_Added once the UI is further along._

## Demo

```text
Phone: 08012345678
Password: password123
```

(Demo credentials will be wired up once Phase 2 builds the mock auth service. For now, the Login screen has a temporary "Continue as demo user" button to preview the authenticated shell.)

## Architecture

- `src/pages/auth/*` — unauthenticated flow, rendered inside `AuthLayout`
- `src/pages/app/*` — authenticated flow, rendered inside `AppLayout`
- `src/layouts/` — shell components (`AppLayout` = sidebar/bottom nav, `AuthLayout` = centered card)
- `src/components/nav/` — `Sidebar` (desktop) and `BottomNav` (mobile), both driven by `src/lib/navigation.ts` so nav items are defined once
- `src/lib/routes.ts` — single source of truth for route paths
- `src/store/` — Zustand stores; `useAuthStore` is a Phase 1 stub, replaced with the real mock auth service in Phase 2
- `src/components/RequireAuth.tsx` — route guard, redirects to `/login` and preserves the intended destination
- `src/components/ErrorBoundary.tsx` — catches render errors app-wide instead of a blank screen

Pages will call service modules (e.g. `transferService.createTransfer(payload)`) rather than mutating state directly, so a mock service can later be swapped for a real REST API without touching components.

## Running Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Disclaimer

> PayFlow is an independent portfolio project. It is not affiliated with, endorsed by, or connected to OPay or any other financial institution. All transactions are simulated and no real money is processed.
