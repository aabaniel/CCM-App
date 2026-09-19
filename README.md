# 1440 Web

A Vercel-ready Next.js conversion of the 1440 iOS starter.

**Product thesis:** You have a daily budget of 1,440 minutes. Plan tomorrow, execute today, and compare the day you actually lived with the balance you intended to build.

## What works in this starter

- mobile-first browser UI with Today / Tomorrow / History / Progress tabs;
- daily personal targets for Health, Relationships, Identity, and Challenge / Interest;
- neutral Maintenance and Free categories;
- manual 24-hour planning in 15-minute increments;
- overlap prevention and unallocated-time accounting;
- deterministic projected/final balance score;
- fixed vs flexible activities;
- activity Start / Done / Skip states;
- cascading future schedule shifts after a late completion;
- localStorage persistence (no database required for MVP demo);
- XP, level, and streak scaffolding;
- optional browser alerts while the page remains open;
- `/api/classify` and `/api/optimize` Next.js server routes;
- OpenAI Structured Outputs when `OPENAI_API_KEY` is configured;
- deterministic classifier/optimizer fallbacks when it is not configured;
- domain tests for scoring, schedule shifting, and optimizer validation.

## Run locally

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To verify:

```bash
npm run test
npm run typecheck
npm run build
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the GitHub repo.
4. Vercel should detect Next.js automatically; keep the default build settings.
5. Click **Deploy**.

The app works without any environment variables.

### Optional OpenAI integration

In Vercel → Project → Settings → Environment Variables, add:

```text
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.6-luna
```

Never use `NEXT_PUBLIC_OPENAI_API_KEY`. The key is read only inside Next.js server routes.

Without a key, the demo uses deterministic fallback classification and optimization so reviewers can still experience the full flow.

## Important web-demo notification limitation

The native iOS concept schedules reliable local OS notifications. A normal browser page cannot reliably run arbitrary future timers after the page is closed. This web conversion therefore provides best-effort browser notifications while the page remains open.

A later production web phase can add Web Push + service-worker subscriptions + a server-side scheduler if background notifications are required.

## Repository map

```text
app/                      Next.js App Router pages and API routes
components/               Product screens and reusable UI
lib/domain/               Deterministic business logic
lib/storage/              localStorage-backed application state
lib/ai/                   Server-only OpenAI helper
lib/demo/                 Demo seed data
tests/                    Pure-domain tests
docs/                     Architecture, status, phase plans, product reference
```

See `docs/ARCHITECTURE.md` before changing cross-feature contracts.

## Collaborators
- name 1
- @aabaniel
- name 3
- name 4
- Nier
- Ryan
