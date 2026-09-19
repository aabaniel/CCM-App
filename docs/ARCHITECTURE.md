# Architecture

## Product boundary

1440 Web is a mobile-first Next.js application for intentional daily time allocation. A user's day is a 1,440-minute budget. The user plans tomorrow, executes today, and compares actual time with personally chosen daily targets.

## Runtime architecture

### Client application

React client components render the Today, Tomorrow, History, and Progress experiences.

Browser `localStorage` is the MVP source of truth. This is intentional for a zero-account Vercel demo. The state key is versioned (`1440.web.v1`).

### Deterministic domain layer

`lib/domain/` owns:
- score calculation;
- planned/actual aggregation;
- schedule overlap validation;
- unallocated ranges;
- overrun cascading;
- deterministic optimization fallback;
- AI proposal validation;
- XP and streak rules;
- day-plan lifecycle.

React components should not duplicate those rules.

### Server API routes

`POST /api/classify`
- accepts one task name;
- uses OpenAI Structured Outputs if `OPENAI_API_KEY` exists;
- otherwise uses a deterministic keyword classifier;
- returns the submitted `task_name`, one fixed category, and confidence.

`POST /api/optimize`
- accepts targets and existing activity IDs/times/categories/flexibility;
- may call OpenAI when configured;
- otherwise uses deterministic optimization;
- validates all output before returning it;
- never receives task titles because titles are unnecessary for time-allocation optimization.

### OpenAI boundary

`OPENAI_API_KEY` is server-only. Do not expose it through client environment variables.

AI may:
- classify a task;
- propose moving/resizing existing flexible activities.

AI may not:
- add or delete activities;
- modify fixed activities;
- calculate authoritative score;
- award XP;
- mutate browser persistence directly.

## Domain invariants

1. A DayPlan is identified by a local `YYYY-MM-DD` key.
2. Schedule positions are integer minutes from 0 through 1440.
3. Activities stay inside one local day.
4. Activities do not overlap.
5. Each activity has exactly one category.
6. Each activity is fixed or flexible.
7. Actual time is separate from planned time.
8. A skipped task has no direct score penalty.
9. Maintenance and Free appear in time accounting but do not affect balance score.
10. Free is intentionally allocated. Unallocated is empty schedule space.
11. Historical finalized plans are read-only in the MVP.
12. Optimization never invents activities.

## Scoring contract

Scored categories:
- Health
- Relationships
- Identity
- Challenge / Interest

For each scored category `k`:
- `T_k` = user target minutes
- `X_k` = planned minutes (projected score) or actual minutes (final score)

```text
D = sum(abs(X_k - T_k))
N = sum(max(X_k, T_k))
score = N == 0 ? 100 : clamp(100 * (1 - D/N), 0, 100)
```

The score means congruence with the user's own declared allocation. It is not a clinical or universal health score and is not the validated Life Balance Inventory score.

## XP contract

- Commit tomorrow: +30
- Start at least one activity: +20
- Complete at least one activity: +20
- Finalize daily loop: +30

Each event is idempotent per date. Balance score does not affect XP.

`level = floor(totalXP / 500) + 1`

## Persistence migration path

MVP: browser localStorage only.

Future production option:
- Supabase/Postgres or another durable store;
- anonymous/account identity;
- client cache with server sync;
- explicit migration from localStorage state version 1.

Do not introduce server persistence until a phase explicitly requires multi-device/account behavior.

## Notification behavior

Web MVP notifications are demo-grade only. Browser timers can fire while the app remains open and permission is granted. They are not reliable after the page/browser is closed.

Reliable background behavior requires a later Web Push architecture or returning to the native iOS app.
