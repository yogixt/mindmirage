import type { ReactNode } from "react";

export default function EditorialHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: ReactNode;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
        <h2
          className="display text-3xl text-ink sm:text-4xl shrink-0"
          style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>
        {subtitle && (
          <>
            <div className="hidden lg:block w-px self-stretch bg-ink/10" />
            <p className="max-w-md text-sm leading-relaxed text-ink-soft lg:pt-1">
              {subtitle}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
