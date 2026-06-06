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

  const [sheets, formspree] = await Promise.all([
    forwardToSheets(payload).catch((e) => {
      errors.push(`sheets:${asMessage(e)}`);
      return false;
    }),
    forwardToFormspree(payload).catch((e) => {
      errors.push(`formspree:${asMessage(e)}`);
      return false;
    }),
  ]);

  return { sheetsOk: sheets, formspreeOk: formspree, errors };
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
