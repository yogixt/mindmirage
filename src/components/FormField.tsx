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

const baseField =
  "w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors";

export const Field = forwardRef<HTMLInputElement, InputProps>(function Field(
  { label, hint, required, className = "", ...rest },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-ink-soft">
        {label}
        {required && <span className="text-saffron"> *</span>}
      </span>
      <input ref={ref} required={required} className={`${baseField} ${className}`} {...rest} />
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextArea(
  { label, hint, required, className = "", rows = 4, ...rest },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-ink-soft">
        {label}
        {required && <span className="text-saffron"> *</span>}
      </span>
      <textarea
        ref={ref}
        required={required}
        rows={rows}
        className={`${baseField} resize-y ${className}`}
        {...rest}
      />
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, required, options, className = "", ...rest },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-ink-soft">
        {label}
        {required && <span className="text-saffron"> *</span>}
      </span>
      <select ref={ref} required={required} className={`${baseField} ${className}`} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
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
      className={`mt-4 inline-flex items-center justify-center px-10 py-4 text-sm transition-all ${
        state === "ok"
          ? "bg-gold text-ink"
          : state === "error"
          ? "bg-saffron text-paper"
          : "bg-ink text-paper hover:scale-[1.03] disabled:opacity-60"
      }`}
    >
      {label}
    </button>
  );
}

export type { SubmitState };
