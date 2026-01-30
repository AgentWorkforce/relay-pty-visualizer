# RFC-005: Pluggable Redaction Layer

## Problem
Sensitive payloads can leak into dashboard/UI logs and replays; ad-hoc scrubbing is error-prone.

## Proposal
- Redaction pipeline at ingest: configurable rules (regex, field allowlist/denylist, hash, mask) applied before storage and fan-out.
- Rules defined per workspace and per channel/agent; stored in `redaction.yaml`.
- Daemon tags events with `redacted: true` and keeps a hash of original for integrity (optional).
- Client hint header `X-Redaction-Profile` lets agents request stricter rules.
- Dashboard displays “redacted” badges and supports hover-to-reveal gated by permission.

## API/CLI changes
- `agent-relay redact test <payload>` to preview rules.
- `redact list|add|rm` commands; enforcement on by default for broadcast channels.

## Data & storage
- Original payload discard by default; optional sealed vault (encrypted file) with TTL for audits.

## Risks / mitigations
- Over-redaction reduces usefulness: include rule testing + dry-run.
- Performance: precompile regex; cache rule sets.

## Rollout
1) Rule engine + CLI
2) Daemon enforcement + tags
3) Dashboard UI affordances
