# Personal Codex Engineering Workflow

## Default working style

Optimize for correctness, maintainability, and efficient token/context usage.

Before editing:
- inspect the repository and existing instructions;
- understand existing conventions before introducing new ones;
- read only the files needed for the current task;
- do not broadly crawl documentation when targeted context is sufficient.

## Architecture invariants

- This is a Next.js App Router + React + TypeScript web application.
- Browser `localStorage` is the MVP source of truth for plans, history, and XP.
- Keep scoring, schedule collision/shift logic, and XP deterministic and independent of AI.
- Four scored categories are Health, Relationships, Identity, and Challenge / Interest.
- Maintenance and Free are neutral. Free is intentional allocation; unallocated time is empty schedule space.
- Activities never overlap and belong to one local calendar day.
- Each activity has one category and is either fixed or flexible.
- AI may classify tasks or propose changes to existing flexible activities only. It may not invent activities, compute scores, award XP, or directly mutate persistence.
- All AI output is untrusted and must be validated before use.
- `OPENAI_API_KEY` is server-only. Never expose it through `NEXT_PUBLIC_*`, client bundles, logs, or checked-in files.
- Historical finalized days are immutable in the MVP.
- Web notifications are best-effort demo behavior while the app is open. Do not imply browser timers are reliable background scheduling.

## Coding conventions

- Prefer pure functions under `lib/domain/` for business rules.
- Keep React components focused on rendering and user interactions.
- Avoid speculative abstraction and unnecessary dependencies.
- Use local calendar date keys (`YYYY-MM-DD`) rather than UTC dates for DayPlan identity.
- Represent schedule positions as integer minutes from 0 through 1440.
- Preserve 15-minute increments in planner inputs unless a later phase explicitly changes this.

## Validation

Before claiming a phase complete, run the smallest relevant checks:
- `npm run test`
- `npm run typecheck`
- `npm run build` for cross-cutting or deployment changes

Never claim a check passed unless it actually ran.

## Documentation map

- Stable contracts: `docs/ARCHITECTURE.md`
- Current implementation state: `docs/STATUS.md`
- Phase scopes and acceptance criteria: `docs/phases/`
- Original product decisions: `docs/reference/PRODUCT_SPEC.md`

## During implementation

When implementing a phase:
- work only within that phase's scope;
- inspect existing code before editing;
- preserve established repository conventions;
- avoid implementing later phases preemptively;
- make the smallest complete implementation satisfying the acceptance criteria;
- run targeted verification;
- update `docs/STATUS.md` concisely.

## Final completion report

Report only:
1. one-line summary;
2. what new behavior should be visible;
3. important changes;
4. checks run and outcomes;
5. blockers or unsatisfied acceptance criteria.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing Next.js code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
<!-- END:nextjs-agent-rules -->
