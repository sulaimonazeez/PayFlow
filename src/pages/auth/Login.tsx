import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/lib/routes";

// Phase 1 mock: no backend yet, so the "logged in" phone number is hardcoded.
// Phase 2 replaces this with the real mock auth service (see useAuthStore).
const MOCK_PHONE = "+2348012345605";
const PIN_LENGTH = 4;

function maskPhone(phone: string) {
  // +2348012345605 -> +234 80*******05
  const country = phone.slice(0, 4); // "+234"
  const start = phone.slice(4, 6); // "80"
  const end = phone.slice(-2); // "05"
  const middleLength = phone.length - 4 - 2 - 2;
  return `${country} ${start}${"*".repeat(middleLength)}${end}`;
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

  return (
    <div className="flex flex-col items-center pb-[env(safe-area-inset-bottom)]">
      <h2 className="font-display text-lg font-semibold text-ink">Welcome back</h2>
      <p className="mt-1 text-sm text-ink/60">Enter your PIN to continue</p>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-medium text-ink">{maskPhone(MOCK_PHONE)}</span>
        <button
          type="button"
          onClick={() => {
            // Phase 2: route to a real "change number" flow.
            setPin("");
            setError(false);
          }}
          className="text-sm font-semibold text-primary"
        >
          Not you?
        </button>
      </div>

      {/* Hidden numeric input: drives the real keyboard, paste, and
          autofill. Visually represented by the dots below. */}
      <label htmlFor="pin-input" className="sr-only">
        Enter your {PIN_LENGTH}-digit PIN
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

      {/* PIN dots (tapping refocuses the hidden input) */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => inputRef.current?.focus()}
        className={`mt-8 flex gap-4 ${shake ? "animate-shake" : ""}`}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span
            key={i}
            className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
              i < pin.length
                ? error
                  ? "border-danger bg-danger"
                  : "border-primary bg-primary"
                : "border-ink/20 bg-transparent"
            }`}
          />
        ))}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`mt-3 text-sm font-medium text-danger transition-opacity ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error ? "Incorrect PIN, try again" : ""}
      </p>

      {/* Numeric keypad: backup for anyone who prefers tapping over the
          native keyboard. */}
      <div className="mt-6 grid w-full max-w-xs grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            aria-label={`Digit ${digit}`}
            disabled={submitting}
            onClick={() => handleKeypadDigit(digit)}
            className="rounded-2xl bg-ink/5 py-4 text-lg font-semibold text-ink transition active:scale-95 active:bg-ink/10 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        <span />
        <button
          type="button"
          aria-label="Digit 0"
          disabled={submitting}
          onClick={() => handleKeypadDigit("0")}
          className="rounded-2xl bg-ink/5 py-4 text-lg font-semibold text-ink transition active:scale-95 active:bg-ink/10 disabled:opacity-50"
        >
          0
        </button>
        <button
          type="button"
          aria-label="Delete last digit"
          disabled={submitting || pin.length === 0}
          onClick={handleBackspace}
          className="rounded-2xl py-4 text-sm font-semibold text-ink/60 transition active:scale-95 active:bg-ink/10 disabled:opacity-30"
        >
          Delete
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          // Phase 2: route to a real "forgot PIN" flow.
        }}
        className="mt-8 text-sm font-semibold text-primary"
      >
        Forgot PIN?
      </button>
    </div>
  );
}
