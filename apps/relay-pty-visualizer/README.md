# Relay PTY Visualizer

Animated walkthrough of the agent-relay + relay-pty lifecycle. Packets move from queue → daemon → Unix socket → agent → relay-pty → terminal, while a live PTY pane echoes the simulated stream.

## Features
- Multi-lane flow animation (Framer Motion) showing each hop.
- Live PTY echo view (xterm) with synthetic relay-pty output.
- Metrics chips (queue depth, inflight, latency, delivered).
- Stack/Risks panels summarizing the agent swarm’s chosen plan.
- Timeline cards describing the protocol logic end-to-end.

## Stack
- React + TypeScript (Vite 5.4 pinned for Node 18 compatibility)
- Framer Motion for animation
- @xterm/xterm for PTY surface
- CSS-only styling (custom tokens + Google fonts)

## Run locally
```bash
cd apps/relay-pty-visualizer
npm install        # already run once; repeat if needed
npm run dev        # open http://localhost:5173
```

## Demo
- Inline GIF preview:  
  ![Relay PTY demo](./demo.gif)
- Original video (higher quality): [`demo.mov`](./demo.mov)

## Build
```bash
npm run build
npm run preview    # serves the built bundle
```

## Wiring to real events (TODO)
- Implement a WebSocket/SSE client that consumes daemon/relay events.
- Map events to packet positions and PTY writes (schema in relay-feedback/summary.md).
- Add replay mode using the planned `/sessions/:id/history` endpoint.

## Known limits
- Uses simulated data; no backend ingest yet.
- Vite pinned to 5.4 for Node 18; upgrade to Node 20+ to move back to Vite 7 if desired.
