# RFC-003: Replayable Sessions

## Problem
Reproducing bugs/demos requires manual re-scripting; JSONL logs aren’t easily playout-capable.

## Proposal
- Add `agent-relay replay <file|session-id> [--speed 1.0] [--filter agent=*]` that re-injects recorded events/messages into a sandbox workspace.
- Modes: `simulate` (no real agents; writes to stub sockets) and `live` (targets running agents with safety guardrails).
- Dashboard gets a “Replay” tab with play/pause/scrub and speed controls.

## API/CLI changes
- New `replay` command; `--dry-run` to show plan only.
- Recorded sessions annotated with `replayable: true` when storage is complete (no gaps).

## Data & storage
- Uses existing JSONL; optional “bundle” (gzipped) export for portability.
- Integrity check: per-line seq + sha256 to detect tampering.

## Risks / mitigations
- Accidental re-send to prod agents: default to sandbox mode; require `--force-live`.
- Long sessions: allow time-window slicing `--from --to`.

## Rollout
1) CLI + simulator
2) Dashboard scrubber UI
3) Live mode with guardrails
