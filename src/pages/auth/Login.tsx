import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/lib/routes";

// Phase 1 mock: no backend yet, so the "logged in" phone number is hardcoded.
// Phase 2 replaces this with the real mock auth service (see useAuthStore).
const MOCK_PHONE = "+2348012345605";
const PIN_LENGTH = 6;

function maskPhone(phone: string) {
  // +2348012345605 -> ***5605 (last 4 digits, matches design)
  return `***${phone.slice(-4)}`;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const inputRef = useRef<HTMLInputElement>(null);

  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Autofocus the hidden input so the OS keyboard is ready immediately.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    setSubmitting(true);
    // No backend yet: any complete PIN is accepted.
    setTimeout(() => {
      login();
      navigate(ROUTES.dashboard);
    }, 300);
  };

  const handleChange = (raw: string) => {
    if (submitting) return;
    const digits = raw.replace(/\D/g, "").slice(0, PIN_LENGTH);
    setError(false);
    setPin(digits);
    if (digits.length > pin.length) vibrate(10);
    if (digits.length === PIN_LENGTH) submit();
  };

  const handleKeypadDigit = (digit: string) => {
    if (submitting || pin.length >= PIN_LENGTH) return;
    handleChange(pin + digit);
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    if (submitting) return;
    setError(false);
    setPin((p) => p.slice(0, -1));
    inputRef.current?.focus();
  };

  const initials = "WO"; // Phase 2: derive from real user profile

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 px-6 pb-[env(safe-area-inset-bottom)] pt-4">
      {/* Top bar: back arrow + phone pill */}
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-white/90"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-sm font-semibold text-amber-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"/></svg>
          {maskPhone(MOCK_PHONE)}
        </span>
      </div>

      {/* Avatar */}
      <div className="mt-10 flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-slate-800 bg-blue-600">
        <span className="text-2xl font-bold text-white">{initials}</span>
      </div>

      {/* Phone pill under avatar */}
      <span className="mt-4 flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-sm font-semibold text-amber-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"/></svg>
        {maskPhone(MOCK_PHONE)}
      </span>

      <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome back!</h2>
      <p className="mt-1 text-base text-white/60">Enter your {PIN_LENGTH} digit passcode</p>

      {/* Hidden numeric input: drives the real keyboard, paste, and
          autofill. Visually represented by the boxes below. */}
      <label htmlFor="pin-input" className="sr-only">
        Enter your {PIN_LENGTH}-digit passcode
      </label>
      <input
        ref={inputRef}
        id="pin-input"
        type="text"
        inputMode="none"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        maxLength={PIN_LENGTH}
        value={pin}
        disabled={submitting}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setPin("");
            setError(false);
          }
        }}
        className="sr-only"
      />

      {/* Passcode boxes (tapping refocuses the hidden input) */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => inputRef.current?.focus()}
        className={`mt-8 grid w-full max-w-sm grid-cols-6 gap-2 rounded-2xl bg-slate-900 p-3 ${
          shake ? "animate-shake" : ""
        }`}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < pin.length;
          const active = i === pin.length;
          return (
            <span
              key={i}
              className={`flex h-14 items-center justify-center rounded-xl border-2 text-xl font-semibold text-white transition-colors ${
                active
                  ? "border-amber-400 bg-slate-800"
                  : error
                  ? "border-red-500 bg-slate-800"
                  : "border-transparent bg-slate-800"
              }`}
            >
              {filled ? "•" : ""}
            </span>
          );
        })}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`mt-3 text-sm font-medium text-red-400 transition-opacity ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error ? "Incorrect passcode, try again" : ""}
      </p>

      {/* Numeric keypad */}
      <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            aria-label={`Digit ${digit}`}
            disabled={submitting}
            onClick={() => handleKeypadDigit(digit)}
            className="flex aspect-square items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white transition active:scale-95 active:bg-slate-700 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          aria-label="Delete last digit"
          disabled={submitting || pin.length === 0}
          onClick={handleBackspace}
          className="flex aspect-square items-center justify-center rounded-full bg-slate-800 text-white transition active:scale-95 active:bg-slate-700 disabled:opacity-30"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Digit 0"
          disabled={submitting}
          onClick={() => handleKeypadDigit("0")}
          className="flex aspect-square items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white transition active:scale-95 active:bg-slate-700 disabled:opacity-50"
        >
          0
        </button>
        <button
          type="button"
          aria-label="Submit passcode"
          disabled={submitting || pin.length !== PIN_LENGTH}
          onClick={submit}
          className="flex aspect-square items-center justify-center rounded-full bg-slate-800 text-white transition active:scale-95 active:bg-slate-700 disabled:opacity-30"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          // Phase 2: route to a real "forgot passcode" flow.
        }}
        className="mt-8 text-sm font-semibold text-amber-400"
      >
        Forgot passcode?
      </button>
    </div>
  );
}
