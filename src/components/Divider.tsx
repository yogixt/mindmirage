type Props = {
  variant?: "light" | "dark";
  symbol?: string;
};

export default function Divider({ variant = "light", symbol = "✦" }: Props) {
  const line =
    variant === "dark" ? "bg-gold/30" : "bg-ink/15";
  const sym =
    variant === "dark" ? "text-gold" : "text-saffron";
  return (
    <div className="mx-auto my-3 flex max-w-xs items-center gap-5">
      <div className={`h-px flex-1 ${line}`} />
      <span className={`ornament ${sym}`} aria-hidden>
        {symbol}
      </span>
      <div className={`h-px flex-1 ${line}`} />
    </div>
  );
}
