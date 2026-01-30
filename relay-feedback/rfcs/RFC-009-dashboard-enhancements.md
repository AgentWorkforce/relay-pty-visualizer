# RFC-009: Dashboard UX Enhancements

## Problem
Hard to inspect PTY output, threads, and branches in one place; filtering is limited.

## Proposal
- Inline PTY view per agent with search and time jump; thread view with filters (agent, channel, trace_id, time window).
- Thread-to-branch linking: allow tagging threads with git branch/task ID; display badge.
- Quick actions: resend/replay thread, export as markdown, open in new window.
- Metrics ribbons: queue depth, drop rate, health lights (from RFC-006), capability tags (RFC-008).

## Risks / mitigations
- UI complexity: progressive disclosure; defaults remain simple list.

## Rollout
1) PTY viewer + search
2) Thread filters + exports
3) Branch/task tagging + metrics ribbons
