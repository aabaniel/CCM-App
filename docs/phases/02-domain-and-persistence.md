# 02 — Domain and local persistence

## Goal

Domain and local persistence.

## Scope

Types, scoring, schedule rules, XP rules, localStorage version 1 state.

## Explicit non-scope

Cloud database or authentication.

## Relevant contracts

See `docs/ARCHITECTURE.md`. Preserve its domain and security invariants.

## Acceptance criteria

- Domain tests pass.
- Reload preserves local state.
- Invalid overlapping schedules are rejected.
