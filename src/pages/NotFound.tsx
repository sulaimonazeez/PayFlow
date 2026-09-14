import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-ink/60">The page you're looking for doesn't exist.</p>
      <Link
        to={ROUTES.dashboard}
        className="mt-6 rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
