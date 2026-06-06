type Props = {
  deva: string;
  en?: string;
  citation?: string;
  align?: "center" | "left";
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
};

export default function SanskritVerse({
  deva,
  en,
  citation,
  align = "center",
  variant = "light",
  size = "md",
}: Props) {
  const devaSize =
    size === "lg" ? "text-3xl sm:text-4xl" : size === "sm" ? "text-base" : "text-xl sm:text-2xl";
  const enSize = size === "lg" ? "text-base sm:text-lg" : "text-sm sm:text-base";
  const devaColor = variant === "dark" ? "text-gold-soft" : "text-black";
  const enColor = variant === "dark" ? "text-[#C8B79B]" : "text-[#1A1A1A]";
  const refColor = variant === "dark" ? "text-[#9B8A72]" : "text-ink-soft";
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignCls}`}>
      <p className={`deva whitespace-pre-line ${devaSize} ${devaColor}`}>
        {deva}
      </p>
      {en && (
        <p
          className={`sanskrit-italic mt-2 leading-snug ${enSize} ${enColor}`}
        >
          {en}
        </p>
      )}
      {citation && (
        <p className={`eyebrow mt-2 ${refColor}`}>{citation}</p>
      )}
    </div>
  );
}
