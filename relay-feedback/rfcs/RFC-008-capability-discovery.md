# RFC-008: Agent Capability Discovery

## Problem
Leads guess which agent can do what; misrouting tasks wastes cycles.

## Proposal
- Agents publish a small manifest (`capabilities.json`) listing skills/templates/tags and current status.
- `agent-relay who --caps` aggregates manifests; shows tags (frontend, backend, db, security, etc.) and availability (busy/idle).
- Dashboard adds filter-by-capability and quick “route task to capable agents” button.

## Data & storage
- Manifests cached in `.agent-relay/team/capabilities.json`; updated on agent connect.

## Risks / mitigations
- Stale data: agents republish on status change; TTL fallback.

## Rollout
1) Manifest format + publish hook in agents
2) CLI who --caps
3) Dashboard filtering
