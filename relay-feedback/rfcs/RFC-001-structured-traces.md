# RFC-001: Structured Timelines & Traces

## Problem
Hard to debug end-to-end flows (spawn → inject → ack → stdout). Messages, PTY output, and file writes are siloed across JSONL, worker logs, and dashboard.

## Proposal
- Introduce a first-class **Trace** object with `trace_id`, `session_id`, `agent`, `thread`, timestamps, and ordered **Events** (message send/recv, PTY output, file write, state change).
- New CLI: `agent-relay trace start <name>` returns `trace_id`; downstream commands auto-attach `trace_id` (or use env `RELAY_TRACE_ID`).
- JSONL storage gains `trace_id` column; daemon stitches PTY lines and relay events into a single ordered stream.
- Dashboard “Timeline” view to scrub a trace, filter by event type, and export as HAR/JSON.

## API/CLI changes
- `agent-relay trace start|end|show <trace_id>`
- Optional header `TRACE:` in file protocol; relay-pty passes through.

## Data & storage
- Append-only JSONL; nightly compaction into per-trace files optional.

## Risks / mitigations
- Storage growth: add TTL/compaction; configurable trace sampling (off by default).
- Privacy: traces inherit redaction rules (see RFC-004).

## Rollout
1) Schema + storage support
2) CLI bindings
3) Dashboard timeline UI
