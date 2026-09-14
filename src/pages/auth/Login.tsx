import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/lib/routes";

// Phase 1 mock: no backend yet, so the "logged in" phone number is hardcoded.
// Phase 2 replaces this with the real mock auth service (see useAuthStore).
const MOCK_PHONE = "+2348012341605";
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

  const initials = "AS"; // Phase 2: derive from real user profile

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-gradient-to-b from-[#0b1220] to-[#0f1729] px-6 pb-[env(safe-area-inset-bottom)] pt-4">
      {/* Top bar: back arrow + phone pill */}
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-white/90"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#f0b93a] ring-1 ring-white/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"/></svg>
          {maskPhone(MOCK_PHONE)}
        </span>
      </div>

      {/* Avatar */}
      <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f6bff] to-[#2d3fd6] shadow-lg shadow-[#2d3fd6]/30 ring-1 ring-white/10">
        <span className="text-lg font-bold text-white">{initials}</span>
      </div>

      {/* Phone pill under avatar */}
      <span className="mt-3 flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-[#f0b93a] ring-1 ring-white/10">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"/></svg>
        {maskPhone(MOCK_PHONE)}
      </span>

      <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white text-center">Welcome back!</h2>
      <p className="mt-1 text-sm text-slate-400">Enter your {PIN_LENGTH} digit passcode</p>

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
        className={`mt-5 grid w-full max-w-xs grid-cols-6 gap-1.5 rounded-2xl bg-white/[0.04] p-2 ring-1 ring-white/5 ${
          shake ? "animate-shake" : ""
        }`}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < pin.length;
          const active = i === pin.length;
          return (
            <span
              key={i}
              className={`flex h-11 items-center justify-center rounded-lg border-2 text-lg font-semibold text-white transition-colors ${
                active
                  ? "border-[#f0b93a] bg-white/[0.06]"
                  : error
                  ? "border-red-500 bg-white/[0.06]"
                  : "border-transparent bg-white/[0.06]"
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
        className={`mt-2 text-xs font-medium text-red-400 transition-opacity ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error ? "Incorrect passcode, try again" : ""}
      </p>

      {/* Numeric keypad: fixed sizes so it never balloons on tall screens */}
      <div className="mt-5 grid grid-cols-3 gap-x-6 gap-y-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            aria-label={`Digit ${digit}`}
            disabled={submitting}
            onClick={() => handleKeypadDigit(digit)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] text-xl font-bold text-white ring-1 ring-white/5 transition active:scale-95 active:bg-white/[0.12] disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          aria-label="Delete last digit"
          disabled={submitting || pin.length === 0}
          onClick={handleBackspace}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] text-white ring-1 ring-white/5 transition active:scale-95 active:bg-white/[0.12] disabled:opacity-30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Digit 0"
          disabled={submitting}
          onClick={() => handleKeypadDigit("0")}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] text-xl font-bold text-white ring-1 ring-white/5 transition active:scale-95 active:bg-white/[0.12] disabled:opacity-50"
        >
          0
        </button>
        <button
          type="button"
          aria-label="Submit passcode"
          disabled={submitting || pin.length !== PIN_LENGTH}
          onClick={submit}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f0b93a] to-[#d69a1f] text-[#1a1300] shadow-lg shadow-[#f0b93a]/20 transition active:scale-95 disabled:from-white/[0.06] disabled:to-white/[0.06] disabled:text-white disabled:shadow-none disabled:opacity-40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          // Phase 2: route to a real "forgot passcode" flow.
        }}
        className="mt-5 mb-4 text-sm font-semibold text-[#f0b93a]"
      >
        Forgot passcode?
      </button>
    </div>
  );
}
