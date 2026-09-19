# 06 — AI classification

## Goal

AI classification.

## Scope

Server route, server-only OpenAI key, structured output, deterministic fallback.

## Explicit non-scope

Chatbot or user-profile inference.

## Relevant contracts

See `docs/ARCHITECTURE.md`. Preserve its domain and security invariants.

## Acceptance criteria

- No API key appears in client bundle.
- Manual planner still works if AI is down.
- Category response is one allowed value.
