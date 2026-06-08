import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  deva?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, deva, title, description, children }: Props) {
  return (
    <section className="relative bg-paper px-6 pt-20 pb-2 sm:pb-3">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow animate-fade-rise opacity-0">{eyebrow}</p>
        {deva && (
          <p className="deva animate-fade-rise opacity-0 mt-1.5 text-lg text-ink sm:text-xl">
            {deva}
          </p>
        )}
        <h1
          className="display animate-fade-rise-delay opacity-0 mt-2 text-3xl text-ink sm:text-4xl md:text-5xl"
          style={{ lineHeight: "1.0", letterSpacing: "-0.025em" }}
        >
          {title}
        </h1>
        {description && (
          <div className="animate-fade-rise-delay-2 opacity-0 mx-auto mt-2 max-w-2xl text-sm text-ink-soft leading-relaxed">
            {description}
          </div>
        )}
        {children && (
          <div className="animate-fade-rise-delay-3 opacity-0 mt-3">{children}</div>
        )}
      </div>
    </section>
  );
}
