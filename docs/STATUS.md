# Status

Current phase: **Core web MVP complete and locally verified**

Last completed phase:
- Converted native iOS starter contracts to Next.js 16.3 / React 19.3 / TypeScript.
- Added localStorage persistence, planner/execution/history/progress UI, domain engines, API routes, and deterministic AI fallbacks.
- Added Today-first new-day review, target-based advisory recommendations, start/end demo alerts, and visible schedule overages.
- History now includes each finalized day’s timeline alongside its score, pie chart, and target-versus-actual analytics.

Important decisions:
- Next.js App Router deployed on Vercel
- Browser localStorage is MVP source of truth
- No database or login required for demo
- Server-only optional OpenAI integration
- Four scored domains; Maintenance and Free neutral
- AI advisory only; deterministic code owns scores and schedule validity
- Web background notifications explicitly remain a limitation

Verification performed during conversion packaging:
- `npm run test` passes (8 tests covering scoring, overrun accounting, recommendations, scheduling, and optimizer validation).
- `npm run typecheck` passes.
- `npm run build` passes with Next.js 16.3.0.

Canonical project verification commands after dependencies are installed:
- `npm run test`
- `npm run typecheck`
- `npm run build`

Known limitation:
- Browser notifications are demo-grade while the app is open. Reliable closed-browser notifications require the future Web Push/service-worker architecture in phase 10.
