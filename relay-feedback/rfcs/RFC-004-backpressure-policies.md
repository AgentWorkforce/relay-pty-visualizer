# RFC-004: Backpressure & Rate Policies

## Problem
High event rates can overwhelm agents, UI, and storage; current queue has fixed limits.

## Proposal
- Per-agent policy: `max_queue`, `max_inflight`, `sample_rate`, `burst_limit`, `drop_strategy` (drop-oldest / sample / block).
- CLI: `agent-relay policy set <agent> --max-queue 200 --sample-rate 0.2 --burst 50/10s`.
- Daemon enforces policies and emits `policy_drop` events when invoked.
- Dashboard shows live queue depth, drops, and sampling state.

## Data & storage
- Policies stored in workspace config (JSON); telemetry logs include policy fields on drops.

## Risks / mitigations
- Over-aggressive drops could hide signal: defaults remain generous; warn when drops > threshold.
- Complexity: provide presets (`low`, `default`, `high-throughput`).

## Rollout
1) Policy schema + CLI
2) Daemon enforcement
3) Dashboard visualization
