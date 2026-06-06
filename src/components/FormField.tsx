import { forwardRef } from "react";

type Common = {
  label: string;
  hint?: string;
  required?: boolean;
};

type InputProps = Common & React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = Common &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: ReadonlyArray<{ value: string; label: string }>;
  };

/* Contact-form style: rounded fields, placeholder-as-label, focus ring. */
const baseField =
  "w-full rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition";

export const Field = forwardRef<HTMLInputElement, InputProps>(function Field(
  { label, hint, required, placeholder, className = "", ...rest },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="sr-only">{label}</span>
      <input
        ref={ref}
        required={required}
        placeholder={placeholder ?? label}
        className={`${baseField} ${className}`}
        {...rest}
      />
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextArea(
  { label, hint, required, placeholder, className = "", rows = 4, ...rest },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="sr-only">{label}</span>
      <textarea
        ref={ref}
        required={required}
        rows={rows}
        placeholder={placeholder ?? label}
        className={`${baseField} resize-none ${className}`}
        {...rest}
      />
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, required, options, className = "", defaultValue, ...rest },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="sr-only">{label}</span>
      <select
        ref={ref}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={`${baseField} invalid:text-ink-faint ${className}`}
        {...rest}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink">
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
});

type SubmitState = "idle" | "sending" | "ok" | "error";

export function SubmitButton({
  state,
  children = "Send",
  okLabel = "नमस्ते — received",
  errorLabel = "Try again",
}: {
  state: SubmitState;
  children?: React.ReactNode;
  okLabel?: string;
  errorLabel?: string;
}) {
  const label =
    state === "sending"
      ? "Sending…"
      : state === "ok"
      ? okLabel
      : state === "error"
      ? errorLabel
      : children;
  return (
    <button
      type="submit"
      disabled={state === "sending" || state === "ok"}
      className={`w-full rounded-2xl py-3.5 text-sm font-semibold transition-colors ${
        state === "ok"
          ? "bg-gold text-ink"
          : state === "error"
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-saffron text-white hover:bg-clay disabled:opacity-60"
      }`}
    >
      {label}
    </button>
  );
}

export type { SubmitState };
