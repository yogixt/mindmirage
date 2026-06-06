/**
 * Free-tier notification fan-out for form submissions.
 *
 * - Mirrors the payload to a Google Apps Script webhook (so it lands in a
 *   Google Sheet for tracking).
 * - Mirrors a human-readable copy to Formspree (so it lands as email in
 *   namaste@mindmirageindia.com).
 *
 * Either side can be unconfigured — we'll log and continue. The form on the
 * client gets a 200 as long as one side accepted, so a half-configured
 * environment still works.
 */

type Payload = Record<string, unknown> & { _kind: string };

export type NotifyResult = {
  sheetsOk: boolean;
  formspreeOk: boolean;
  errors: string[];
};

export async function notify(payload: Payload): Promise<NotifyResult> {
  const errors: string[] = [];

  const [sheets, formspree, resend] = await Promise.all([
    forwardToSheets(payload).catch((e) => {
      errors.push(`sheets:${asMessage(e)}`);
      return false;
    }),
    forwardToFormspree(payload).catch((e) => {
      errors.push(`formspree:${asMessage(e)}`);
      return false;
    }),
    forwardToResend(payload).catch((e) => {
      errors.push(`resend:${asMessage(e)}`);
      return false;
    }),
  ]);

  return { sheetsOk: sheets, formspreeOk: formspree || resend, errors };
}

async function forwardToSheets(payload: Payload): Promise<boolean> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!url) {
    console.warn("[notify] GOOGLE_SHEETS_WEBHOOK not set — skipping Sheets");
    return false;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}

async function forwardToFormspree(payload: Payload): Promise<boolean> {
  const url = process.env.FORMSPREE_ENDPOINT;
  if (!url) {
    console.warn("[notify] FORMSPREE_ENDPOINT not set — skipping email");
    return false;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `Mind Mirage · ${payload._kind}`,
      ...payload,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}

/* Resend — free tier email straight to the team's Gmail.
   Needs RESEND_API_KEY (+ optional NOTIFY_EMAIL_TO, defaults below). */
async function forwardToResend(payload: Payload): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[notify] RESEND_API_KEY not set — skipping Resend email");
    return false;
  }
  const to = (process.env.NOTIFY_EMAIL_TO ?? "namaste@mindmirageindia.com")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const rows = Object.entries(payload)
    .filter(([k]) => k !== "_kind")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#555;text-transform:capitalize">${k}</td><td style="padding:6px 12px;color:#111;white-space:pre-line">${String(v ?? "")}</td></tr>`,
    )
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.NOTIFY_EMAIL_FROM ?? "Mind Mirage <onboarding@resend.dev>",
      to,
      subject: `Mind Mirage · New ${payload._kind}`,
      html: `<div style="font-family:Georgia,serif;max-width:560px"><h2 style="color:#C0531F">New ${payload._kind}</h2><table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${rows}</table><p style="color:#999;font-size:12px;margin-top:16px">Also saved in the admin portal inbox.</p></div>`,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}

function asMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/** Always succeed for the client even if both sides fail — log loudly. */
export function buildResponse(kind: string, result: NotifyResult) {
  if (!result.sheetsOk && !result.formspreeOk) {
    console.error(
      `[notify] ${kind} fan-out failed completely`,
      result.errors,
    );
  }
  return {
    ok: true,
    kind,
    delivered: {
      sheets: result.sheetsOk,
      email: result.formspreeOk,
    },
  };
}
