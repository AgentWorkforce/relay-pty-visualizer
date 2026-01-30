# RFC-010: Dev Mocks & CI Harness

## Problem
Integration tests and CI runs need relay/pty behavior without spawning real CLIs or daemons.

## Proposal
- Provide a mocked daemon + relay-pty simulator (`agent-relay mock up`) that exposes the same sockets and file protocol but echoes scripted responses.
- Fixture language (YAML/JSON) to script message flows, PTY outputs, and delays; usable in CI.
- Node SDK test helpers to start/stop the mock in-process.
- Flag in logs when running under mock to avoid confusion.

## Risks / mitigations
- Divergence from real behavior: keep simulator driven by the same protocol schemas; run conformance tests against real daemon periodically.

## Rollout
1) Mock server binary/CLI
2) Fixture format + examples
3) CI recipes for GitHub Actions
