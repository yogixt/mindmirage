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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-paper shadow-2xl ring-1 ring-black/5">
            <div className="border-b border-ink/5 px-6 py-5 text-center">
              <p className="display mt-1.5 text-xl text-ink">Support the Word</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                What is given freely is sustained freely. Your support keeps this
                work alive — no strings, no fine print, just the teaching.
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="eyebrow text-ink-faint">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun"
                  className="mt-1.5 w-full rounded-xl border border-ink/10 bg-paper-warm px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
              <div>
                <label className="eyebrow text-ink-faint">Offering (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="e.g. 500"
                  className="mt-1.5 w-full rounded-xl border border-ink/10 bg-paper-warm px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[100, 500, 1000, 5000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(String(v))}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                      amount === String(v)
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-ink/10 text-ink-faint hover:border-ink/30"
                    }`}
                  >
                    ₹{v.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
                  {error}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-ink/5 px-6 py-4">
              <button
                type="button"
                onClick={() => { setOpen(false); setError(null); }}
                className="text-xs text-ink-faint hover:text-ink transition-colors"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={pay}
                disabled={busy}
                className="rounded-full bg-gold px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-gold/85 disabled:opacity-60"
              >
                {busy ? "Please wait…" : `Offer ${amount ? `₹${parseInt(amount, 10).toLocaleString("en-IN")}` : ""}`}
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
