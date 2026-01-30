# Relay PTY Discovery

An interactive visualization of the agent-relay + relay-pty pipeline. Watch messages move from queue → daemon → Unix socket → agent → PTY injection → terminal, with live metrics, risks/stack notes, and a demo GIF.

> Original task prompt: “look at this repo https://github.com/AgentWorkforce/relay and create a swam of agents using the relay protocol to create an app where a user can see and experience animations of how the relay-pty works and all the logic involved. You should get agents who talk to each other via the relay protocol to come up with the best technology choices, install the best skills needed via the prpm cli and the best way to build the webapp. Please record this prompt and monitor the conversation to create a transcript. Note any blockers or issues with the protocol as you figure out how to set it up and get the relay daemon running to allow the agents to communicate.”

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

![Relay PTY demo](apps/relay-pty-visualizer/demo.gif)

(Original video: `apps/relay-pty-visualizer/demo.mov` for higher quality.)

## Notes
- Node 18 compatible (Vite pinned to 5.4); upgrade to Node 20+ to move to Vite 7 if desired.
- Backend/event wiring is stubbed; see `relay-feedback/summary.md` for the planned API/schema.

## Trajectories
- Current trajectory export: `trail export traj_b5axzwaok9ur` (summary in [`relay-feedback/trajectory-summary.md`](relay-feedback/trajectory-summary.md)).
- Trail/trajectories project: https://github.com/AgentWorkforce/trajectories
