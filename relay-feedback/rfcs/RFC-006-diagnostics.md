# RFC-006: Diagnostics & Doctor Command

## Problem
When messaging stalls, users dig through multiple logs; no single “why is it slow/stuck?” command.

## Proposal
- `agent-relay diag` outputs: daemon status, socket health, queue depths per agent, stuck outbox files, file permissions, MCP sidecar status, recent errors.
- Add periodic self-checks; emit `health_event` if thresholds exceeded.
- Dashboard “Diagnostics” panel with traffic lights for daemon, sockets, MCP, storage, and policy drops.

## Data & storage
- Health snapshots stored in `.agent-relay/health/` with timestamp for trend view.

## Risks / mitigations
- False alarms: thresholds configurable; defaults tuned to typical workloads.

## Rollout
1) CLI doctor command
2) Background health pings
3) Dashboard surface
