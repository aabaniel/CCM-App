# 07 — AI optimizer

## Goal

AI optimizer.

## Scope

Optimize existing flexible blocks, validate proposal, preview score, apply/keep original.

## Explicit non-scope

Inventing activities or changing fixed blocks.

## Relevant contracts

See `docs/ARCHITECTURE.md`. Preserve its domain and security invariants.

## Acceptance criteria

- Unknown IDs are rejected.
- Fixed changes are rejected.
- Proposal cannot overlap or leave the day.
