# RFC-002: Message Schema Registry & Validation

## Problem
Payload drift and malformed commands cause silent failures; no shared contract across agents/CLIs.

## Proposal
- Add a JSON Schema registry (local `schemas/` dir) with versioned schemas per message `type`.
- Daemon validates inbound messages (ingest + file protocol) against registered schema; on failure, quarantines message and emits `validation_error` event.
- CLI: `agent-relay schema add <name> <file>`; `schema list`, `schema test <payload.json>`.
- Agents can request the active schema hash to ensure compatibility.

## API/CLI changes
- New command group `schema`.
- File protocol optional header `SCHEMA:` to pin expected schema name.

## Data & storage
- Schemas stored in JSON, versioned with semver; hashed for integrity.
- Validation results logged in JSONL with `schema_version` and `error`.

## Risks / mitigations
- Performance hit on hot paths: cache compiled schemas (ajv) and short-circuit if unchanged.
- Partial rollout: “warn” mode default; “enforce” opt-in per workspace.

## Rollout
1) Registry + CLI
2) Daemon enforcement (warn → enforce)
3) Dashboard surfacing of validation errors
