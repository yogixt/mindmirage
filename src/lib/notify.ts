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

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }) + " (IST)";

  const icon =
    payload._kind === "Booking" ? "📅" :
    payload._kind === "Order" ? "✨" :
    payload._kind === "Volunteer" ? "🤝" :
    payload._kind === "Internship" ? "🎓" : "✉️";

  const rows = Object.entries(payload)
    .filter(([k]) => k !== "_kind")
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, " $1").trim();
      const value = String(v ?? "");
      return `
        <tr>
          <td style="padding:16px 20px;background-color:#FDFBF8;border-bottom:1px solid #F3EFE9;font-size:11px;font-weight:700;color:#8A857C;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;width:30%">
            ${label}
          </td>
          <td style="padding:16px 20px;background-color:#ffffff;border-bottom:1px solid #F3EFE9;font-size:14px;color:#1D1B18;line-height:1.6;vertical-align:top;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;white-space:pre-line">
            ${value}
          </td>
        </tr>
      `;
    })
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Mind Mirage · New ${payload._kind}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#FAF8F5;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAF8F5;padding:40px 16px;width:100%">
        <tr>
          <td align="center">
            <table width="100%" max-width="580px" style="max-width:580px;background-color:#ffffff;border:1px solid #EFECE6;border-radius:24px;box-shadow:0 12px 40px -12px rgba(192,83,31,0.06);overflow:hidden;border-collapse:separate" border="0" cellspacing="0" cellpadding="0">
              
              <!-- Brand Header -->
              <tr>
                <td style="padding:40px 40px 10px 40px;text-align:center">
                  <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#1D1B18;letter-spacing:-0.02em">
                    Mind Mirage<span style="color:#C0531F">.</span>
                  </div>
                  <div style="font-size:10px;font-weight:600;color:#8A857C;text-transform:uppercase;letter-spacing:0.2em;margin-top:6px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
                    Advaita Sadhana Kutir
                  </div>
                </td>
              </tr>

              <!-- Header Icon -->
              <tr>
                <td style="padding:20px 40px 10px 40px;text-align:center">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto">
                    <tr>
                      <td style="background-color:#FFF6F2;border-radius:50%;width:64px;height:64px;text-align:center;vertical-align:middle;font-size:28px;color:#C0531F;line-height:64px">
                        ${icon}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Notification Title -->
              <tr>
                <td style="padding:0 40px 24px 40px;text-align:center">
                  <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:600;color:#C0531F;margin:0;letter-spacing:-0.01em">
                    New ${payload._kind} Received
                  </h2>
                  <div style="width:40px;height:2px;background-color:#C0531F;margin:16px auto 0 auto;border-radius:1px"></div>
                </td>
              </tr>

              <!-- Fields Card Table -->
              <tr>
                <td style="padding:0 40px 24px 40px">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:separate;border:1px solid #EFECE6;border-radius:16px;overflow:hidden;width:100%">
                    ${rows}
                  </table>
                </td>
              </tr>

              <!-- Action Button -->
              <tr>
                <td style="padding:10px 40px 30px 40px;text-align:center">
                  <a href="https://mindmirageindia.com/dashboard" style="display:inline-block;background-color:#C0531F;color:#FFFFFF;font-family:Georgia,serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:30px;box-shadow:0 6px 20px rgba(192,83,31,0.15)">
                    Access Seeker Dashboard →
                  </a>
                </td>
              </tr>

              <!-- Help Callout Card -->
              <tr>
                <td style="padding:0 40px 40px 40px">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FFF6F2;border:1px solid #FADED0;border-radius:16px;width:100%">
                    <tr>
                      <td style="padding:20px;text-align:center">
                        <p style="margin:0;font-family:Georgia,serif;font-size:15px;font-weight:700;color:#C0531F">
                          Advaita Sadhana Kutir
                        </p>
                        <p style="margin:6px 0 0 0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#7A5340;line-height:1.5">
                          If you have any questions or need to reach support, contact us at <a href="mailto:namaste@mindmirageindia.com" style="color:#C0531F;font-weight:700;text-decoration:none;border-bottom:1px solid #C0531F">namaste@mindmirageindia.com</a>.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer info -->
              <tr>
                <td style="background-color:#FAF8F5;padding:30px 40px;text-align:center;border-top:1px solid #EFECE6">
                  <p style="margin:0;font-size:12px;color:#8A857C;line-height:1.6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
                    This email notification was automatically generated on <span style="font-weight:600;color:#1D1B18">${formattedDate}</span>.
                    <br />
                    © ${new Date().getFullYear()} Mind Mirage India. All rights reserved.
                  </p>
                  <div style="margin-top:16px;font-size:12px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
                    <a href="https://mindmirageindia.com" style="color:#C0531F;text-decoration:none;font-weight:600;margin:0 8px">Website</a>
                    <span style="color:#D5D2C9">•</span>
                    <a href="https://mindmirageindia.com/dashboard" style="color:#C0531F;text-decoration:none;font-weight:600;margin:0 8px">Dashboard</a>
                    <span style="color:#D5D2C9">•</span>
                    <a href="mailto:namaste@mindmirageindia.com" style="color:#C0531F;text-decoration:none;font-weight:600;margin:0 8px">Support</a>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

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
      html: emailHtml,
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
