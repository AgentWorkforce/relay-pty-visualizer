# Relay PTY Discovery

An interactive visualization of the agent-relay + relay-pty pipeline. Watch messages move from queue → daemon → Unix socket → agent → PTY injection → terminal, with live metrics, risks/stack notes, and a demo GIF.

## What’s here
- `apps/relay-pty-visualizer/` — React/TypeScript frontend (Vite 5.4) with animated flow, PTY echo view, and demo media (`demo.gif`, `demo.mov`).
- `relay-feedback/` — Summary report and RFCs for improving agent-relay (traces, schemas, replay, backpressure, redaction, diagnostics, attachments, capability discovery, dashboard UX, dev mocks).

## Quick start
```bash
cd apps/relay-pty-visualizer
npm install
npm run dev   # open http://localhost:5173
```

Build & preview:
```bash
npm run build
npm run preview
```

## Demo
Inline GIF lives in `apps/relay-pty-visualizer/demo.gif` (also `demo.mov` for higher quality).

## Notes
- Node 18 compatible (Vite pinned to 5.4); upgrade to Node 20+ to move to Vite 7 if desired.
- Backend/event wiring is stubbed; see `relay-feedback/summary.md` for the planned API/schema.
