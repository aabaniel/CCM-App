# 03 — Tomorrow planner

## Goal

Tomorrow planner.

## Scope

Daily targets, add/remove blocks, categories, fixed/flexible, 24-hour allocation, projected score, commit.

## Explicit non-scope

Recurring schedules and calendar integrations.

## Relevant contracts

See `docs/ARCHITECTURE.md`. Preserve its domain and security invariants.

## Acceptance criteria

- User can create a non-overlapping tomorrow plan.
- Projected score updates deterministically.
- Free and unallocated remain distinct.
