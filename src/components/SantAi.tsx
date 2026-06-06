"use client";

import MonkGlyph from "./MonkGlyph";
import { usePastHero } from "./WhatsAppButton";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

type Role = "user" | "assistant";
type Message = { role: Role; content: string; time: string };
type BotState = "happy" | "thinking" | "meditating" | "speaking" | "blessing";

const QUICK_ACTIONS = [
  { label: "Teach me a mantra", prompt: "Teach me a mantra I can chant daily." },
  { label: "Daily practice", prompt: "Suggest a daily practice for a beginner sādhak." },
  { label: "Guided meditation", prompt: "Guide me through a short meditation." },
];

const FIRST_MESSAGE: Message = {
  role: "assistant",
  content:
    "Namaste, sādhak.\n\nI'm Sant AI, here to guide you on your inner journey. How may I support you today?",
  // Left blank to avoid SSR/CSR locale mismatch — the welcome message stays
  // timeless; sent/received messages get their timestamp on the client.
  time: "",
};

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/**
 * Floating Sant AI chat — popup panel modelled on the design system spec.
 * Warm cream + rounded look (overrides the global white/square theme for this
 * surface only). Drop monk avatars into /public/sant-ai/ to make the bot
 * states render; missing images hide gracefully.
 */
export default function SantAi() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([FIRST_MESSAGE]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [sound, setSound] = useState(true);
  const [botState, setBotState] = useState<BotState>("meditating");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pastHero = usePastHero();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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
      const res = await fetch("/api/sant-ai", {
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
      setMessages([...next, { role: "assistant", content, time: nowTime() }]);
      setTimeout(() => setBotState("meditating"), 2200);
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
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Sant AI"
        className={`fixed bottom-6 right-6 z-30 transition-all hover:scale-[1.1] ${
          mounted && pastHero && !open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ transitionDuration: "600ms" }}
      >
        <span className="sant-float sant-glow block rounded-full ring-2 ring-gold/50">
          <MonkGlyph size={68} />
        </span>
      </button>

      {/* Panel */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex items-end justify-end p-0 sm:p-6 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />
        <section
          role="dialog"
          aria-label="Sant AI"
          className={`relative flex h-full w-full flex-col overflow-hidden bg-[#FAF3E0] text-ink shadow-2xl ring-1 ring-black/[0.05] transition-transform sm:h-[680px] sm:max-h-[90vh] sm:w-[440px] sm:rounded-3xl ${
            open ? "translate-y-0" : "translate-y-8"
          }`}
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-3 border-b border-black/[0.06] bg-white/70 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <Avatar state={botState} size={40} />
              <div>
                <p style={{ fontFamily: "var(--font-instrument-serif), serif" }} className="text-lg leading-tight text-ink">
                  Sant AI
                </p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                  Mind Mirage · Rishikesh
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSound((s) => !s)}
                aria-label={sound ? "Mute sound" : "Unmute sound"}
                className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-black/[0.04] hover:text-ink"
              >
                {sound ? <Speaker className="w-4" /> : <SpeakerOff className="w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-black/[0.04] hover:text-ink"
              >
                <Close className="w-4" />
              </button>
            </div>
          </header>

          {/* Welcome strip (small) */}
          {messages.length === 1 && (
            <div className="px-5 pt-4 text-center">
              <p style={{ fontFamily: "var(--font-instrument-serif), serif" }} className="text-2xl text-ink">
                Welcome, Sādhak{" "}
                <Leaf className="inline-block w-5 align-middle text-[#7e8a4b]" />
              </p>
              <div className="mx-auto mt-2 flex max-w-[180px] items-center gap-2">
                <div className="h-px flex-1 bg-[#B8862B]/40" />
                <span className="text-[10px] text-[#B8862B]">◆</span>
                <div className="h-px flex-1 bg-[#B8862B]/40" />
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                Ask, reflect, grow. The wisdom is within.
              </p>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} time={m.time} />
            ))}
            {pending && <TypingIndicator />}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 border-t border-black/[0.05] bg-white/40 px-4 py-3 sm:px-5">
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q.label}
                type="button"
                disabled={pending}
                onClick={() => void send(q.prompt)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#B8862B]/40 bg-white px-3 py-1.5 text-[11px] text-ink transition-colors hover:bg-[#B8862B]/10 disabled:opacity-50"
              >
                <Leaf className="w-3 text-[#7e8a4b]" />
                {q.label}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="border-t border-black/[0.05] bg-white px-3 py-3">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 ring-1 ring-black/[0.06]">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Type your message…"
                disabled={pending}
                className="flex-1 resize-none border-0 bg-transparent py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <button
                type="button"
                aria-label="Voice input"
                className="grid size-8 place-items-center rounded-full text-ink-soft hover:text-ink"
              >
                <Mic className="w-4" />
              </button>
              <button
                type="button"
                onClick={() => void send()}
                disabled={pending || !input.trim()}
                aria-label="Send"
                className="grid size-9 place-items-center rounded-full bg-[#7e8a4b] text-white shadow-sm transition-transform hover:scale-[1.04] disabled:opacity-40"
              >
                <Send className="w-4" />
              </button>
            </div>
            <p className="deva mt-2 text-center text-[11px] text-ink-soft">
              <span className="mr-1.5 text-[#B8862B]">ॐ</span>
              न हि ज्ञानेन सदृशं पवित्रमिह विद्यते
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

/* ─────────────────────────  Bubbles  ───────────────────────── */

function Bubble({ role, content, time }: { role: Role; content: string; time: string }) {
  if (role === "user") {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-[80%] rounded-3xl rounded-br-md bg-[#c8d3a8] px-4 py-2.5 text-sm text-ink shadow-sm">
          <p className="whitespace-pre-line leading-relaxed">{content}</p>
          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-ink-soft">
            <span>{time}</span>
            <DoubleCheck className="w-3" />
          </div>
        </div>
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/[0.05]">
          <UserIcon className="w-3.5 text-ink-soft" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <Avatar state="happy" size={36} />
      <div className="max-w-[80%] rounded-3xl rounded-tl-md bg-white px-4 py-3 text-sm text-ink shadow-sm ring-1 ring-black/[0.04]">
        <p className="font-medium text-[#B7410E]">Sant AI</p>
        <p className="mt-1.5 whitespace-pre-line leading-relaxed">{content}</p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-ink-soft">
          <span>{time || " "}</span>
          <Lotus className="w-3 text-[#B8862B]/70" />
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <Avatar state="thinking" size={28} />
      <div className="flex items-center gap-2 rounded-full bg-[#c8d3a8] px-3 py-1.5 text-[11px] text-ink">
        <span>Sant AI is typing</span>
        <span className="flex gap-0.5">
          <span className="size-1 rounded-full bg-ink animate-bounce [animation-delay:0ms]" />
          <span className="size-1 rounded-full bg-ink animate-bounce [animation-delay:120ms]" />
          <span className="size-1 rounded-full bg-ink animate-bounce [animation-delay:240ms]" />
        </span>
      </div>
    </div>
  );
}

function Avatar({ size = 36 }: { state?: BotState; size?: number }) {
  return <MonkGlyph size={size} />;
}

/* ─────────────────────────  Inline icons  ───────────────────────── */

type IconProps = { className?: string };

function Lotus({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3c1.4 2.4 1.4 5 0 7.5C10.6 8 10.6 5.4 12 3Z" />
      <path d="M12 11c-2.5 1-4.2 2.7-6 5.5 3 .2 5-.6 6-2 1 1.4 3 2.2 6 2-1.8-2.8-3.5-4.5-6-5.5Z" />
      <path d="M5 7.5c.4 1.7 1.7 3.4 3.5 4.4-.8-2.5-1.6-4-3.5-4.4Z" />
      <path d="M19 7.5c-.4 1.7-1.7 3.4-3.5 4.4.8-2.5 1.6-4 3.5-4.4Z" />
    </svg>
  );
}
function Leaf({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20 4c-9 1-15 7-16 16 2 0 5-1 8-3 6-4 8-9 8-13Z" opacity="0.9" />
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
function Close({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}
