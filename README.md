# Mind Mirage

> **तत्त्वमसि — That thou art.**
> A contemplative learning space at Advaita Sādhanā Kuṭīr, Rishikesh.

Phase 1 portal — zero-budget, Next.js 16 (App Router), Tailwind v4, TypeScript,
deployed on Vercel.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local      # fill in keys (all optional in dev)
pnpm dev                        # http://localhost:3000
```

First load shows a 7-second breathing meditation (skippable), then reveals the
homepage with a looping cinematic video hero.

---

## Free infrastructure (Phase 1)

| Concern              | Service                | Cost                           |
| -------------------- | ---------------------- | ------------------------------ |
| Hosting              | Vercel free tier       | ₹0                             |
| Sant Ai chat (prod)  | Groq free tier         | ₹0 (rate-limited but generous) |
| Sant Ai chat (dev)   | Ollama (local)         | ₹0                             |
| Seeker accounts      | Clerk free tier        | ₹0 (up to 10,000 MAU)          |
| Form fan-out (sheet) | Google Apps Script     | ₹0                             |
| Form fan-out (email) | Formspree free tier    | ₹0 (50 / month)                |
| Blog / content       | MDX files in this repo | ₹0                             |
| Video hero           | CloudFront URL (given) | ₹0                             |
| WhatsApp / email     | Existing channels      | ₹0                             |

---

## Sant Ai backend

The chat widget at the bottom-right of every page is powered by the Vercel AI
SDK and routes through whichever model is configured.

### Production — Groq

1. Sign up at https://console.groq.com (free, no card required).
2. Create an API key.
3. Set `GROQ_API_KEY` in `.env.local` and in the Vercel project settings.
4. Default model is `llama-3.3-70b-versatile`. Override with `GROQ_MODEL`.

### Local development — Ollama

```bash
brew install ollama          # or download from ollama.com
ollama pull gemma3:4b
ollama serve                 # runs at http://localhost:11434
```

Then in `.env.local`:

```
USE_OLLAMA=1
OLLAMA_MODEL=gemma3:4b
```

Production deployments (where `USE_OLLAMA` is not set) automatically use Groq.

Swap to any other AI SDK provider in `src/lib/ai.ts` if your needs change.

---

## Seeker accounts (Clerk)

`/sign-in`, `/sign-up`, and `/dashboard` are powered by Clerk. The dashboard
shows each seeker's enrolled programs (saved to their Clerk `publicMetadata`)
and a small profile — city, preferred path, why-I-seek — that Acharya Ji can
read in the Clerk console.

When a signed-in seeker submits the enrollment form, the program slug is
automatically added to their dashboard alongside the usual Sheet + email
fan-out.

### Setup

1. Sign up at https://dashboard.clerk.com (free, no card).
2. Create an application — enable Email and Google.
3. From "API keys", copy both values into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_…
   CLERK_SECRET_KEY=sk_test_…
   ```
4. Add the same two values to the Vercel project's environment variables.

Without these keys, `/sign-in`, `/sign-up`, and `/dashboard` render a
"not yet configured" notice and the rest of the site works normally.

Where the data lives:

- `enrolledPrograms: string[]` in Clerk `publicMetadata` — set by the
  enrollment API route in `src/app/api/enroll/route.ts`.
- `city`, `preferredPath`, `whyISeek` — set by the dashboard profile form via
  the server action in `src/app/dashboard/actions.ts`.
- All helper logic lives in `src/lib/auth.ts`.

---

## Form submissions

Every form (enrollment, booking, inquiry, internship, volunteer) posts JSON to
a Next.js API route in `src/app/api/*`. The route validates with Zod and fans
out to two free services in parallel.

### Google Sheets webhook

1. Create a new Google Sheet.
2. **Extensions → Apps Script** and paste:

   ```js
   function doPost(e) {
     const data = JSON.parse(e.postData.contents);
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const headers = Object.keys(data);
     if (sheet.getLastRow() === 0) sheet.appendRow(headers);
     sheet.appendRow(headers.map((h) => data[h]));
     return ContentService.createTextOutput(
       JSON.stringify({ status: "ok" })
     ).setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app** · Execute as: *Me* · Access:
   *Anyone with the link*.
4. Copy the `/exec` URL into `GOOGLE_SHEETS_WEBHOOK` in `.env.local`.

### Formspree email

1. Sign up at https://formspree.io.
2. Create one form pointed at `namaste@mindmirageindia.com`.
3. Copy the endpoint URL into `FORMSPREE_ENDPOINT`.

---

## Content

Blog posts and other long-form content live as MDX files in `src/content/`.
Acharya Ji (or anyone with repo access) adds a new `.mdx` file → commits →
Vercel auto-deploys.

Frontmatter shape:

```yaml
---
title: "…"
date: "2026-04-01"
author: "Acharya Bhagyashree Joshi Ji"
type: "blog" # blog | note | teaching | quiz | announcement
tags: ["yoga-sutras"]
excerpt: "…"
sanskrit: "अथ योगानुशासनम्"
translation: "Now, the teaching of Yoga."
---
```

Course bodies live in `src/lib/constants.ts` (`COURSES`).

---

## Brand & aesthetic

- **Display** — Instrument Serif (italic emphasis for sacred words)
- **Body** — Inter
- **Sanskrit** — Noto Serif Devanagari
- **Palette** — `paper`, `ink`, `ink-soft`, with sacred accents `gold`,
  `saffron`, `indigo`, `indigo-deep`
- **Animations** — `fade-rise`, `breath-in/out`, `om-glow` defined in
  `src/app/globals.css` as Tailwind v4 animation tokens

---

## Deploy to Vercel

```bash
pnpm dlx vercel        # first deploy — follow prompts
# then in Vercel dashboard:
#   1. Add custom domain mindmirageindia.com
#   2. Update DNS at registrar
#   3. Add the environment variables from .env.local
```

---

## Folder map

```
src/
├── app/
│   ├── api/                Form fan-out + Sant Ai
│   ├── programs/[slug]/    Course detail + enroll
│   ├── blog/[slug]/        MDX-rendered posts
│   ├── dashboard/          Seeker dashboard (Clerk-protected)
│   ├── sign-in/            Clerk sign-in (catch-all route)
│   ├── sign-up/            Clerk sign-up (catch-all route)
│   └── …                   All public pages
├── components/             Navbar, Footer, SantAi, forms, hero, breathing
├── content/                MDX (blog + extendable collections)
├── middleware.ts           Clerk middleware — protects /dashboard
└── lib/                    constants, ai, auth, notify, mdx, sant-ai-prompt
```

---

## Phase 2 (post-budget)

Seeker login + dashboard now live (Clerk-backed, free tier). Still ahead:
assignment uploads, automated chapter unlocking, Razorpay payments — see the
spec at `MINDMIRAGE_PROJECT_SPEC_1.md` for the roadmap.

---

*ॐ तत् सत्*
