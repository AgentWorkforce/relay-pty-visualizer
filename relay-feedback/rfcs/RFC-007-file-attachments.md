# RFC-007: Lightweight File Attachments

## Problem
Agents sometimes need to send small artifacts; base64 in messages is clunky and pollutes logs.

## Proposal
- Introduce attachment primitive: files ≤2 MB stored in `.agent-relay/uploads/` with `attachment_id`, checksum, content-type, and expiry.
- Message header `ATTACH:` lists one or more `attachment_id`s; dashboard renders download links with size/type.
- CLI: `agent-relay attach send <path> --to Agent` auto-creates attachment and sends message with reference.
- Expiry/TTL configurable; cleanup job removes expired attachments.

## Risks / mitigations
- Storage bloat: enforce size limits and TTL; optional zip compression.
- Security: checksum + optional AV scan hook; restrict to workspace scope.

## Rollout
1) Attachment storage + CLI helper
2) Message header support
3) Dashboard rendering + cleanup cron
