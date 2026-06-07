"use client";

import Link from "next/link";
import MonkGlyph from "@/components/MonkGlyph";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { SITE } from "@/lib/constants";

type Role = "user" | "assistant";
type Message = { role: Role; content: string; time: string };

type BotState = "happy" | "thinking" | "meditating" | "speaking" | "blessing";

const BOT_STATES: { key: BotState; label: string }[] = [
  { key: "happy", label: "Happy" },
  { key: "thinking", label: "Thinking" },
  { key: "meditating", label: "Meditating" },
  { key: "speaking", label: "Speaking" },
  { key: "blessing", label: "Blessing" },
];

const QUICK_ACTIONS = [
  { label: "Teach me a mantra", prompt: "Teach me a mantra I can chant daily." },
  { label: "Daily practice", prompt: "Suggest a daily practice for a beginner sādhak." },
  { label: "Guided meditation", prompt: "Guide me through a short meditation." },
];

const SIDEBAR_NAV = [
  { label: "Daily Wisdom", href: "#daily-wisdom", icon: "leaf" as const },
  { label: "Guided Meditations", href: "#meditations", icon: "headphones" as const },
  { label: "Teachings", href: "#teachings", icon: "book" as const },
  { label: "Sanskrit Library", href: "#library", icon: "om" as const },
  { label: "My Journey", href: "#journey", icon: "journey" as const },
];

const FIRST_MESSAGE: Message = {
  role: "assistant",
  content:
    "Namaste, sādhak.\n\nI'm Tejas, here to guide you on your inner journey. How may I support you today?",
  time: "",
};

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function TejasPage() {
  const [messages, setMessages] = useState<Message[]>([FIRST_MESSAGE]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [sound, setSound] = useState(true);
  const [theme, setTheme] = useState<"light" | "dim" | "dark">("light");
  const [botState, setBotState] = useState<BotState>("meditating");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || pending) return;
    const next: Message[] = [
      ...messages,
      { role: "user", content: text, time: nowTime() },
    ];
    setMessages(next);
    setInput("");
    setPending(true);
    setBotState("thinking");
    try {
      const res = await fetch("/api/tejas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error ?? `HTTP ${res.status}`);
      }
      const { content } = (await res.json()) as { content: string };
      setBotState("speaking");
      setMessages([
        ...next,
        { role: "assistant", content, time: nowTime() },
      ]);
      setTimeout(() => setBotState("meditating"), 2500);
    } catch {
      setBotState("meditating");
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Forgive me — I could not gather a reply just now. Please try again, or write to Acharya Ji directly.",
          time: nowTime(),
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden text-ink"
      style={{
        background:
          "linear-gradient(180deg, #FAF3E0 0%, #F4ECD8 60%, #EADFC0 100%)",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      {/* Background wash — soft dawn gradient, no asset needed */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          background:
            "linear-gradient(180deg, #FDF2DC 0%, #F8E8C8 35%, #EFE3CC 70%, #E9E2D2 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,250,235,0.45), rgba(255,250,235,0.05) 60%, transparent 100%)",
        }}
      />

      {/* Decorative leaves top corners */}
      <Leaf className="pointer-events-none absolute -top-6 -left-8 w-44 rotate-12 opacity-60 text-[#7e8a4b]" />
      <Leaf className="pointer-events-none absolute -top-6 -right-8 w-48 -rotate-12 scale-x-[-1] opacity-60 text-[#7e8a4b]" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 gap-6 px-4 py-4 sm:px-6 sm:py-4 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
        {/* ───────── SIDEBAR ───────── */}
        <aside className="flex flex-col gap-5 rounded-3xl bg-white/85 p-6 shadow-sm backdrop-blur-md ring-1 ring-black/[0.04]">
          <div className="text-center">
            <Lotus className="mx-auto w-9 text-[#B8862B]" />
            <p className="display mt-2 text-2xl text-ink">
              Mind Mirage<sup className="ml-0.5 text-[10px] text-ink-faint">®</sup>
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-ink-soft">
              Rishikesh
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMessages([FIRST_MESSAGE])}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#B8862B]/40 bg-white px-4 py-2.5 text-sm text-[#B7410E] transition-colors hover:bg-[#B8862B]/10"
          >
            <Plus className="w-4" />
            New Conversation
          </button>

          <nav className="flex flex-col gap-1">
            {SIDEBAR_NAV.map((n) => (
              <button
                key={n.label}
                type="button"
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-[#B8862B]/10"
              >
                <NavIcon name={n.icon} className="w-[18px] text-ink-soft" />
                <span>{n.label}</span>
              </button>
            ))}
          </nav>

          {/* Quote */}
          <div className="mt-auto rounded-2xl bg-white p-5 text-center ring-1 ring-black/[0.05]">
            <Quote className="mx-auto w-5 text-[#B8862B]" />
            <p className="sanskrit-italic mt-2 text-sm leading-relaxed text-ink">
              The mind is restless,
              <br />
              the seer is eternal.
            </p>
            <div className="mx-auto my-3 flex max-w-[120px] items-center gap-2">
              <div className="h-px flex-1 bg-[#B8862B]/30" />
              <span className="text-[#B8862B]">◆</span>
              <div className="h-px flex-1 bg-[#B8862B]/30" />
            </div>
            <p className="text-xs text-ink-soft">– Adi Shankarācārya</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ThemeBtn active={theme === "light"} onClick={() => setTheme("light")}>
              <Sun className="w-4" />
            </ThemeBtn>
            <ThemeBtn active={theme === "dim"} onClick={() => setTheme("dim")}>
              <Circle className="w-4" />
            </ThemeBtn>
            <ThemeBtn active={theme === "dark"} onClick={() => setTheme("dark")}>
              <Moon className="w-4" />
            </ThemeBtn>
          </div>
        </aside>

        {/* ───────── CENTER · CHAT ───────── */}
        <section className="flex min-h-0 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between px-2 pt-2">
            <div className="flex-1 text-center">
              <h1 className="display text-3xl text-ink sm:text-4xl">
                Welcome, Sādhak{" "}
                <Leaf className="inline-block w-6 align-middle text-[#7e8a4b]" />
              </h1>
              <div className="mx-auto mt-2 flex max-w-[260px] items-center gap-3">
                <div className="h-px flex-1 bg-[#B8862B]/40" />
                <span className="text-xs text-[#B8862B]">◆</span>
                <div className="h-px flex-1 bg-[#B8862B]/40" />
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Ask, reflect, grow. The wisdom is within.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSound((s) => !s)}
              className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-ink shadow-sm ring-1 ring-black/[0.05] hover:bg-white"
            >
              {sound ? <Speaker className="w-4" /> : <SpeakerOff className="w-4" />}
              Sound {sound ? "On" : "Off"}
            </button>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="mt-4 flex-1 space-y-5 overflow-y-auto px-1 sm:px-4"
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} time={m.time} />
            ))}
            {pending && <TypingIndicator />}
          </div>

          {/* Quick actions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-2">
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q.label}
                type="button"
                disabled={pending}
                onClick={() => void send(q.prompt)}
                className="inline-flex items-center gap-2 rounded-full border border-[#B8862B]/40 bg-white/85 px-4 py-2 text-xs text-ink backdrop-blur transition-colors hover:bg-white disabled:opacity-50"
              >
                <Leaf className="w-3.5 text-[#7e8a4b]" />
                {q.label}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow-sm ring-1 ring-black/[0.05]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Type your message…"
              disabled={pending}
              className="flex-1 resize-none border-0 bg-transparent py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
            <button
              type="button"
              aria-label="Voice input"
              className="grid size-9 place-items-center rounded-full bg-white text-ink-soft ring-1 ring-black/[0.05] hover:text-ink"
            >
              <Mic className="w-4" />
            </button>
            <button
              type="button"
              onClick={() => void send()}
              disabled={pending || !input.trim()}
              aria-label="Send"
              className="grid size-10 place-items-center rounded-full bg-[#7e8a4b] text-white shadow-sm transition-transform hover:scale-[1.04] disabled:opacity-40"
            >
              <Send className="w-4" />
            </button>
          </div>

          <p className="deva mt-3 text-center text-xs text-ink-soft">
            <span className="mr-1.5 text-[#B8862B]">ॐ</span>
            न हि ज्ञानेन सदृशं पवित्रमिह विद्यते
          </p>
        </section>

        {/* ───────── RIGHT · CHARACTER + WISDOM ───────── */}
        <aside className="flex flex-col gap-5">
          {/* Character with halo */}
          <div className="relative mx-auto aspect-square w-full max-w-[260px]">
            <div
              aria-hidden
              className="absolute inset-2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,209,128,0.65) 0%, rgba(255,209,128,0.15) 55%, transparent 75%)",
                filter: "blur(8px)",
              }}
            />
            <div className="tejas-float relative grid h-full w-full place-items-center">
              <MonkGlyph size={190} />
            </div>
          </div>

          <Link
            href="#"
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#B8862B]/40 bg-white px-5 py-2 text-sm text-ink hover:bg-[#B8862B]/10"
          >
            <Lotus className="w-4 text-[#B8862B]" />
            Sit with Tejas
          </Link>

          {/* Wisdom cards */}
          <div className="mt-2 grid gap-3">
            <WisdomCard
              title="Daily Wisdom"
              body="The quieter you become, the more you can hear."
            />
            <WisdomCard
              title="योगः कर्मसु कौशलम्"
              body="Yoga is excellence in action."
              sanskrit
            />
          </div>

          {/* Bot avatar states (compact) */}
          <div>
            <p className="eyebrow text-center">Tejas states</p>
            <div className="mt-3 flex items-center justify-between">
              {BOT_STATES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setBotState(s.key)}
                  aria-label={s.label}
                  className={`grid size-10 place-items-center rounded-full ring-2 transition ${
                    botState === s.key
                      ? "ring-[#B8862B] bg-white"
                      : "ring-transparent bg-white/60 hover:bg-white"
                  }`}
                >
                  <MonkGlyph size={32} />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ─────────────────────────  Bubbles  ───────────────────────── */

function Bubble({
  role,
  content,
  time,
}: {
  role: Role;
  content: string;
  time: string;
}) {
  if (role === "user") {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-[80%] rounded-3xl rounded-br-md bg-[#c8d3a8] px-5 py-3 text-sm text-ink shadow-sm">
          <p className="whitespace-pre-line leading-relaxed">{content}</p>
          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-ink-soft">
            <span>{time}</span>
            <DoubleCheck className="w-3.5" />
          </div>
        </div>
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/[0.05]">
          <UserIcon className="w-4 text-ink-soft" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <Avatar />
      <div className="relative max-w-[78%] rounded-3xl rounded-tl-md bg-white px-5 py-4 text-sm text-ink shadow-sm ring-1 ring-black/[0.04]">
        <p className="font-medium text-[#B7410E]">Tejas</p>
        <p className="mt-2 whitespace-pre-line leading-relaxed">{content}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-ink-soft">
          <span>{time}</span>
          <Lotus className="w-3.5 text-[#B8862B]/70" />
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <Avatar small />
      <div className="flex items-center gap-2 rounded-full bg-[#c8d3a8] px-4 py-2 text-xs text-ink">
        <span>Tejas is typing</span>
        <span className="flex gap-0.5">
          <span className="size-1 rounded-full bg-ink animate-bounce [animation-delay:0ms]" />
          <span className="size-1 rounded-full bg-ink animate-bounce [animation-delay:120ms]" />
          <span className="size-1 rounded-full bg-ink animate-bounce [animation-delay:240ms]" />
        </span>
      </div>
    </div>
  );
}

function Avatar({ small = false }: { small?: boolean }) {
  const size = small ? "size-9" : "size-11";
  return (
    <div
      className={`${size} shrink-0 overflow-hidden rounded-full bg-[#FAF3E0] ring-1 ring-black/[0.05]`}
    >
      <MonkGlyph size={small ? 36 : 44} />
    </div>
  );
}

/* ─────────────────────────  Wisdom card  ───────────────────────── */

function WisdomCard({
  title,
  body,
  imageSrc,
  sanskrit,
}: {
  title: string;
  body: string;
  imageSrc?: string;
  sanskrit?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.05]">
      {imageSrc && (
        <div
          aria-hidden
          className="h-24 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      )}
      <div className="p-4 text-center">
        <p className={sanskrit ? "deva text-base text-[#B7410E]" : "text-sm font-medium text-ink"}>
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">{body}</p>
        <div className="mx-auto mt-3 flex max-w-[80px] items-center gap-2">
          <div className="h-px flex-1 bg-[#B8862B]/30" />
          <span className="text-[10px] text-[#B8862B]">◆</span>
          <div className="h-px flex-1 bg-[#B8862B]/30" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  Helpers  ───────────────────────── */

function ThemeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-full transition ${
        active
          ? "bg-white text-ink shadow-sm"
          : "text-ink-soft hover:bg-white/60"
      }`}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────  Inline icons (no extra deps)  ───────────────────────── */

type IconProps = { className?: string };

function Lotus({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3c1.4 2.4 1.4 5 0 7.5C10.6 8 10.6 5.4 12 3Z" />
      <path d="M12 11c-2.5 1-4.2 2.7-6 5.5 3 .2 5 -0.6 6 -2 1 1.4 3 2.2 6 2 -1.8 -2.8 -3.5 -4.5 -6 -5.5Z" />
      <path d="M5 7.5c.4 1.7 1.7 3.4 3.5 4.4 -.8 -2.5 -1.6 -4 -3.5 -4.4Z" />
      <path d="M19 7.5c-.4 1.7 -1.7 3.4 -3.5 4.4 .8 -2.5 1.6 -4 3.5 -4.4Z" />
    </svg>
  );
}
function Plus({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function Leaf({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20 4c-9 1-15 7-16 16 2 0 5-1 8-3 6-4 8-9 8-13Z" opacity="0.85" />
      <path d="M4 20c4-5 9-9 16-16" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
function Quote({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7 7c-2 0-4 2-4 4v6h6v-6H6c0-1 1-2 2-2V7H7zm10 0c-2 0-4 2-4 4v6h6v-6h-3c0-1 1-2 2-2V7h-1z" />
    </svg>
  );
}
function Sun({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function Moon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
    </svg>
  );
}
function Circle({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}
function Speaker({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4Z" />
      <path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />
    </svg>
  );
}
function SpeakerOff({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4Z" />
      <path d="M16 9l6 6M22 9l-6 6" />
    </svg>
  );
}
function Mic({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}
function Send({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M3 11 21 3l-8 18-2-8-8-2Z" />
    </svg>
  );
}
function DoubleCheck({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 13l4 4 9-9M9 17l9-9" />
    </svg>
  );
}
function UserIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5" />
    </svg>
  );
}
function NavIcon({ name, className = "" }: { name: "leaf" | "headphones" | "book" | "om" | "journey"; className?: string }) {
  if (name === "leaf") return <Leaf className={className} />;
  if (name === "headphones")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="5" height="6" rx="1.2" />
        <rect x="16" y="14" width="5" height="6" rx="1.2" />
      </svg>
    );
  if (name === "book")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z" />
        <path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8Z" />
      </svg>
    );
  if (name === "om")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <text x="12" y="17" textAnchor="middle" fontSize="16" fontFamily="serif">ॐ</text>
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3c2 3 3 7 0 12-3-5-2-9 0-12Z" opacity="0.85" />
    </svg>
  );
}
