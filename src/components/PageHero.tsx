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
    <section className="relative bg-paper pt-24 pb-3 px-6 sm:pb-5">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow animate-fade-rise opacity-0">{eyebrow}</p>
        {deva && (
          <p className="deva animate-fade-rise opacity-0 mt-2 text-xl text-ink sm:text-2xl">
            {deva}
          </p>
        )}
        <h1
          className="display animate-fade-rise-delay opacity-0 mt-3 text-4xl text-ink sm:text-5xl md:text-6xl"
          style={{ lineHeight: "1.0", letterSpacing: "-0.025em" }}
        >
          {title}
        </h1>
        {description && (
          <div className="animate-fade-rise-delay-2 opacity-0 mt-3 mx-auto max-w-2xl text-base text-ink-soft leading-relaxed">
            {description}
          </div>
        )}
        {children && (
          <div className="animate-fade-rise-delay-3 opacity-0 mt-4">{children}</div>
        )}
      </div>
    </section>
  );
}
