# 08 — Vercel hardening

## Goal

Vercel hardening.

## Scope

Build verification, responsive QA, environment setup, deploy docs, accessibility/error states.

## Explicit non-scope

Native iOS/App Store distribution.

## Relevant contracts

See `docs/ARCHITECTURE.md`. Preserve its domain and security invariants.

## Acceptance criteria

- `npm run test` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- Fresh Vercel deployment works without environment variables.
