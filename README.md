# Mind Mirage

The web platform of Advaita Sadhana Kutir, Rishikesh — courses in Yoga,
Vedanta, Sanskrit, and the Indian knowledge systems, founded by Acharya
Bhagyashree Joshi Ji.

Live at [mindmirageindia.com](https://mindmirageindia.com).

## Stack

- Next.js (App Router) · React · TypeScript · Tailwind CSS
- Clerk — sadhak accounts and enrolment metadata
- Turso (libSQL) — newsletters, bookings, assignments, orders, schedules
- Razorpay — checkout (UPI, cards, net banking) with coupon support
- Groq — Sant AI, the resident guide chatbot

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

Copy `.env.example` to `.env.local` and fill in the keys (Clerk, Turso,
Razorpay, Groq, admin emails).

## Structure

- `src/app` — routes (public site, sadhak dashboard, APIs)
- `src/components` — shared UI
- `src/lib` — constants (single source of truth for courses and prices),
  auth, database, payments, prompts

The team portal is a separate application deployed independently.
