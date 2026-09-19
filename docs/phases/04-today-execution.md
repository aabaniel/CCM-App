# 04 — Today execution

## Goal

Today execution.

## Scope

Start/Done/Skip, actual timestamps, overrun cascade, demo notification timers.

## Explicit non-scope

Reliable closed-browser notifications.

## Relevant contracts

See `docs/ARCHITECTURE.md`. Preserve its domain and security invariants.

## Acceptance criteria

- Start is idempotent.
- Done records actual end.
- Colliding flexible blocks cascade; fixed collision is surfaced.
