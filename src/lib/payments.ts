import type { Client } from "@libsql/client";
import { mindMirageDb } from "./db";
import { enrollUserById, findUserIdByEmail } from "./auth";
import { notify } from "./notify";

async function accountInfo(
  db: Client,
  userId: string,
): Promise<{ name: string | null; email: string | null } | null> {
  const rs = await db.execute({ sql: "SELECT name, email FROM users WHERE id = ?", args: [userId] });
  if (!rs.rows.length) return null;
  return {
    name: rs.rows[0].name ? String(rs.rows[0].name) : null,
    email: rs.rows[0].email ? String(rs.rows[0].email) : null,
  };
}

/* Single place that turns a captured Razorpay payment into our records —
   bookings marked paid, an `orders` row, a `payment_events` row, course
   enrolment, and a sale email to the team. Called from two places that must
   never drift apart:
     - the webhook (/api/razorpay/webhook), the instant Razorpay reports it
     - the reconciliation sweep (/api/razorpay/reconcile), which re-derives
       this from Razorpay's payment history for anything the webhook missed
   Every write is idempotent (INSERT OR IGNORE keyed on payment_id, UPDATE
   guarded on paid = 0), so calling this twice for the same payment is safe. */

export type RazorpayPaymentEntity = {
  id: string;
  order_id: string | null;
  amount: number;
  email?: string | null;
  notes?: Record<string, string>;
};

export type RecordResult = {
  /* True only when this call is the one that first wrote the order/event
     row — i.e. a payment the fast client-side path never recorded. */
  newlyRecorded: boolean;
  items: string;
  amountINR: number;
  email: string;
};

/* Grants (or queues) access to one course for one payment, and logs it to
   enrollment_grants so admin can see exactly who paid, who it's for, and
   whether that person has access yet. Idempotent — INSERT OR IGNORE keyed
   on (payment_id, slug), safe to call from both the webhook and the
   reconciliation sweep for the same payment. */
export async function grantCourseAccess(params: {
  paymentId: string;
  slug: string;
  title: string;
  payerUserId: string | null;
  payerName: string | null;
  payerEmail: string | null;
  /* True when the payer chose "myself" (or there's no distinct payer to
     choose from, e.g. a guest checkout) — false only when they explicitly
     named someone else at checkout. */
  forSelf: boolean;
  /* Who the access is ultimately for. Falls back to the payer's own
     name/email when forSelf and not otherwise given (guest checkouts). */
  forName: string | null;
  forEmail: string | null;
}): Promise<void> {
  const db = mindMirageDb();
  if (!db) return;

  const forName = params.forName || (params.forSelf ? params.payerName : null);
  const forEmail = params.forEmail || (params.forSelf ? params.payerEmail : null);

  let grantedUserId: string | null = null;
  if (params.forSelf && params.payerUserId) {
    grantedUserId = params.payerUserId;
  } else if (forEmail) {
    grantedUserId = await findUserIdByEmail(forEmail);
  }
  if (grantedUserId) {
    await enrollUserById(grantedUserId, params.slug).catch((e) =>
      console.error("[payments] enroll failed", e),
    );
  }

  await db.execute({
    sql: `INSERT OR IGNORE INTO enrollment_grants
          (payment_id, slug, title, payer_user_id, payer_name, payer_email, for_name, for_email, for_self, granted_user_id, granted_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${grantedUserId ? "datetime('now')" : "NULL"})`,
    args: [
      params.paymentId,
      params.slug,
      params.title,
      params.payerUserId,
      params.payerName,
      params.payerEmail,
      forName,
      forEmail,
      params.forSelf ? 1 : 0,
      grantedUserId,
    ],
  });
}

export async function recordCapturedPayment(
  payment: RazorpayPaymentEntity,
): Promise<RecordResult | null> {
  const db = mindMirageDb();
  if (!db) return null;

  const notes = payment.notes ?? {};
  const paymentId = payment.id;
  const orderId = payment.order_id ?? "";
  const amountINR = Math.round(payment.amount / 100);

  if (notes.bookingId) {
    // Slot-first bookings: the main wizard, guest meditation/ashtanga
    // checkout. The booking row already has the contact's name/email/item —
    // no need to trust anything else from the payment notes for those.
    // for_self tells us whether that contact IS the payer (normal case) or
    // someone the signed-in payer explicitly booked this for.
    const bookingId = Number(notes.bookingId);
    const bookingRs = await db.execute({
      sql: "SELECT user_id, name, email, item_slug, for_self FROM bookings WHERE id = ?",
      args: [bookingId],
    });
    const booking = bookingRs.rows[0];

    await db.execute({
      sql: `UPDATE bookings SET status = 'new', paid = 1, payment_id = ?
            WHERE id = ? AND paid = 0`,
      args: [paymentId, bookingId],
    });

    const contactName = booking ? String(booking.name ?? "") : "";
    const contactEmail = booking ? String(booking.email ?? "") : (payment.email ?? "");
    const itemSlug = booking ? String(booking.item_slug ?? "") : (notes.itemSlug ?? "");
    const payerUserId = booking?.user_id ? String(booking.user_id) : null;
    const forSelf = booking ? Number(booking.for_self ?? 1) === 1 : true;
    const title = notes.title || itemSlug;

    await db.execute({
      sql: `INSERT OR IGNORE INTO orders (payment_id, order_id, user_id, user_name, email, items, amount_inr)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [paymentId, orderId, payerUserId, contactName || null, contactEmail || null, title, amountINR],
    });

    const eventInsert = await db.execute({
      sql: `INSERT OR IGNORE INTO payment_events (status, payment_id, order_id, user_name, email)
            VALUES ('success', ?, ?, ?, ?)`,
      args: [paymentId, orderId, contactName || null, contactEmail || null],
    });

    if (itemSlug) {
      const payer = payerUserId ? await accountInfo(db, payerUserId) : null;
      await grantCourseAccess({
        paymentId,
        slug: itemSlug,
        title,
        payerUserId,
        payerName: payer?.name ?? (forSelf ? contactName : null),
        payerEmail: payer?.email ?? (forSelf ? contactEmail : null),
        forSelf,
        forName: forSelf ? null : contactName,
        forEmail: forSelf ? (payer ? null : contactEmail) : contactEmail,
      });
    }

    if (eventInsert.rowsAffected > 0) {
      await notify({
        _kind: "Order",
        sadhak: contactName || "Guest",
        email: contactEmail || "",
        courses: title,
        paymentId,
      }).catch(() => {});
    }

    return { newlyRecorded: eventInsert.rowsAffected > 0, items: title, amountINR, email: contactEmail };
  }

  if (notes.slugs) {
    // Cart checkout for pre-recorded courses — requires sign-in, so
    // /api/razorpay/order stamps the seeker's userId (and, when they chose
    // "someone else" at checkout, the beneficiary's name/email) onto notes.
    const slugs = notes.slugs.split(",").map((s) => s.trim()).filter(Boolean);
    const titleList = (notes.titles || slugs.join(", ")).split(" | ");
    const items = notes.titles || slugs.join(", ");
    const forSelf = notes.forSelf !== "0";
    const forName = notes.forName || null;
    const forEmail = notes.forEmail || null;

    // Orders placed before this field existed on the Razorpay notes have no
    // notes.userId — fall back to the orders row already recorded for this
    // payment (client verify or an earlier reconcile run wrote user_id there).
    let payerUserId = notes.userId || null;
    if (!payerUserId) {
      const existing = await db.execute({
        sql: "SELECT user_id FROM orders WHERE payment_id = ?",
        args: [paymentId],
      });
      if (existing.rows[0]?.user_id) payerUserId = String(existing.rows[0].user_id);
    }

    await db.execute({
      sql: `INSERT OR IGNORE INTO orders (payment_id, order_id, user_id, items, amount_inr, coupon, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [paymentId, orderId, payerUserId, items, amountINR, notes.coupon ?? null, payment.email ?? null],
    });

    const eventInsert = await db.execute({
      sql: `INSERT OR IGNORE INTO payment_events (status, payment_id, order_id, email)
            VALUES ('success', ?, ?, ?)`,
      args: [paymentId, orderId, payment.email ?? null],
    });

    const payer = payerUserId ? await accountInfo(db, payerUserId) : null;
    for (let i = 0; i < slugs.length; i++) {
      await grantCourseAccess({
        paymentId,
        slug: slugs[i],
        title: titleList[i] || slugs[i],
        payerUserId,
        payerName: payer?.name ?? null,
        payerEmail: payer?.email ?? null,
        forSelf,
        forName,
        forEmail,
      });
    }

    if (eventInsert.rowsAffected > 0) {
      await notify({
        _kind: "Order",
        sadhak: payer?.name ?? payerUserId ?? "Unknown",
        email: payment.email ?? "",
        courses: items,
        paymentId,
      }).catch(() => {});
    }

    return { newlyRecorded: eventInsert.rowsAffected > 0, items, amountINR, email: payment.email ?? "" };
  }

  if (notes.kind === "contribution") {
    const items = `Contribution: ${notes.name ?? ""}`;

    await db.execute({
      sql: `INSERT OR IGNORE INTO orders (payment_id, order_id, user_id, user_name, email, items, amount_inr)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        paymentId,
        orderId,
        notes.userId || null,
        notes.name ?? null,
        payment.email ?? null,
        items,
        amountINR,
      ],
    });

    const eventInsert = await db.execute({
      sql: `INSERT OR IGNORE INTO payment_events (status, payment_id, order_id, user_name, email)
            VALUES ('contribution', ?, ?, ?, ?)`,
      args: [paymentId, orderId, notes.name ?? null, payment.email ?? null],
    });

    if (eventInsert.rowsAffected > 0) {
      await notify({
        _kind: "Order",
        sadhak: notes.name ?? "Unknown",
        email: payment.email ?? "",
        courses: `${items} · ₹${amountINR}`,
        paymentId,
      }).catch(() => {});
    }

    return { newlyRecorded: eventInsert.rowsAffected > 0, items, amountINR, email: payment.email ?? "" };
  }

  console.warn("[payments] captured payment with unrecognized notes", paymentId, notes);
  return null;
}
