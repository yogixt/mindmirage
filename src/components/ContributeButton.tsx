"use client";

import { useState } from "react";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCtor = new (options: Record<string, unknown>) => { open: () => void };

export default function ContributeButton() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const pay = async () => {
    setError(null);
    const num = parseInt(amount.replace(/[,.]/g, ""), 10);
    if (!num || num < 10) { setError("Minimum contribution is ₹10."); return; }
    if (!name.trim()) { setError("Please enter your name."); return; }

    setBusy(true);
    try {
      const orderRes = await fetch("/api/razorpay/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: num, name: name.trim() }),
      });
      const orderData = await orderRes.json();
      if (!orderData.ok) throw new Error(orderData.error);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const Rzp = (window as unknown as Record<string, unknown>).Razorpay as RazorpayCtor | undefined;
        if (!Rzp) { setError("Razorpay failed to load."); setBusy(false); return; }
        const rzp = new Rzp({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: "Mind Mirage",
          description: "Support the Word",
          image: "/favicon.ico",
          prefill: { name: name.trim() },
          handler: async (response: Record<string, string>) => {
            const verifyRes = await fetch("/api/razorpay/verify-contribution", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, name: name.trim() }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.ok) { setError("Payment verified but recording failed. Contact the team."); return; }
            setDone(true);
            setOpen(false);
          },
          modal: { ondismiss: () => setBusy(false) },
        });
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group fixed bottom-36 right-6 z-30 animate-fade-rise rounded-full border border-gold/30 bg-paper/90 px-4 py-2.5 text-xs font-semibold text-ink shadow-lg shadow-black/10 backdrop-blur transition-all hover:border-gold/60 hover:bg-paper"
        aria-label="Support the Word"
      >
        <span className="relative flex items-center gap-1.5">
          <span className="absolute -inset-2 animate-ping rounded-full border border-gold opacity-0 [animation-duration:2s]" />
          <span>Support the Word</span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          onClick={() => { setOpen(false); setError(null); }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[28px] bg-paper shadow-2xl ring-1 ring-black/5 animate-fade-rise"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero */}
            <div
              className="relative overflow-hidden px-6 pb-6 pt-8 text-center"
              style={{ background: "radial-gradient(120% 100% at 50% 0%, #FBF1D7 0%, #F8EFDC 45%, #FFFFFF 100%)" }}
            >
              {/* decorative sparks */}
              <span className="pointer-events-none absolute left-8 top-6 size-1.5 rounded-full bg-gold/50" />
              <span className="pointer-events-none absolute right-10 top-10 size-1 rounded-full bg-gold/40" />
              <span className="pointer-events-none absolute right-16 top-4 text-gold/50">✦</span>

              {/* Emblem — a diya flame */}
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#E7C463] to-[#C9A227] shadow-lg shadow-gold/30 ring-4 ring-white/70">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
                  <path d="M12 2.5c1.7 3.2 4.3 4.7 4.3 8.4a4.3 4.3 0 1 1-8.6 0c0-1.7.8-3 1.7-4.1C10.6 8 12 6 12 2.5z" fill="#FFF6DE" />
                  <path d="M12 8c.9 1.7 2.1 2.6 2.1 4.5a2.1 2.1 0 1 1-4.2 0c0-1 .6-1.9 1.2-2.6.5-.6.9-1.1.9-1.9z" fill="#EFA636" />
                </svg>
              </div>

              <p className="display mt-4 text-2xl text-ink">Support the Word</p>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-ink-soft">
                What is given freely is sustained freely — no strings, no fine
                print, just the teaching.
              </p>
            </div>

            {/* Body */}
            <div className="space-y-5 px-6 pt-5">
              <div>
                <label className="eyebrow text-ink-faint">Choose an offering</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map((v) => {
                    const active = amount === String(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAmount(String(v))}
                        className={`rounded-xl border px-1 py-2.5 text-[13px] font-bold transition-all ${
                          active
                            ? "border-transparent bg-gradient-to-br from-[#E7C463] to-[#C9A227] text-white shadow-md shadow-gold/30"
                            : "border-ink/10 bg-paper-warm text-ink hover:-translate-y-0.5 hover:border-gold/50"
                        }`}
                      >
                        ₹{v.toLocaleString("en-IN")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="eyebrow text-ink-faint">Or enter an amount</label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-ink-faint">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="500"
                    className="w-full rounded-xl border border-ink/10 bg-paper-warm py-3 pl-9 pr-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow text-ink-faint">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun"
                  className="mt-2 w-full rounded-xl border border-ink/10 bg-paper-warm px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/5 px-6 py-4">
              <button
                type="button"
                onClick={() => { setOpen(false); setError(null); }}
                className="text-sm text-ink-faint transition-colors hover:text-ink"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={pay}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#E7C463] to-[#C9A227] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-gold/30 transition-transform hover:scale-[1.03] disabled:opacity-60"
              >
                {busy ? (
                  "Please wait…"
                ) : (
                  <>
                    Offer{amount ? ` ₹${parseInt(amount, 10).toLocaleString("en-IN")}` : ""}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {done && (
        <div className="fixed bottom-24 right-6 z-50 animate-fade-rise rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-lg">
          Thank you for your support!
        </div>
      )}
    </>
  );
}
