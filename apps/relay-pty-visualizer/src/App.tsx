import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import "./index.css";

const STAGES = [
  { id: "queue", label: "Queue", hint: "waiting", hue: 46 },
  { id: "daemon", label: "Relay Daemon", hint: "normalize", hue: 162 },
  { id: "socket", label: "UDS Socket", hint: "inject", hue: 198 },
  { id: "agent", label: "Agent", hint: "respond", hue: 282 },
  { id: "pty", label: "relay-pty", hint: "write", hue: 12 },
  { id: "terminal", label: "Terminal", hint: "echo", hue: 320 },
];

const timeline = [
  {
    title: "enqueue",
    body: "Lead drops message into queue with correlation + seq",
  },
  {
    title: "daemon routes",
    body: "Daemon fans out to socket for the correct agent session",
  },
  {
    title: "pty inject",
    body: "relay-pty writes directly into the agent TTY, waits for idle",
  },
  {
    title: "echo verify",
    body: "stdout echoes payload; ack emitted with duration + retries",
  },
  {
    title: "persist",
    body: "Event snapshot rolled into Postgres for replay + metrics",
  },
];

const randomPick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

interface Packet {
  id: string;
  label: string;
  stageIndex: number;
  hue: number;
  state: "queued" | "injecting" | "delivered" | "failed";
}

const sampleBodies = [
  "restart health-worker",
  "stream file tail",
  "spawn Frontend",
  "ask Arch for plan",
  "broadcast #general",
  "ping socket status",
  "send continuity",
];

function usePacketEngine(speed: number, playing: boolean) {
  const [packets, setPackets] = useState<Packet[]>([]);
  const deliveredCount = useRef(0);

  useEffect(() => {
    if (!playing) return;

    const createTimer = setInterval(() => {
      const packet: Packet = {
        id: crypto.randomUUID().slice(0, 8),
        label: randomPick(sampleBodies),
        stageIndex: 0,
        hue: Math.floor(Math.random() * 360),
        state: "queued",
      };
      setPackets((prev) => [...prev, packet].slice(-18));
    }, 1200 / speed);

    const advanceTimer = setInterval(() => {
      setPackets((prev) =>
        prev
          .map((p) => {
            const nextStage = p.stageIndex + 1;
            if (nextStage >= STAGES.length) {
              deliveredCount.current += 1;
              return null;
            }
            return {
              ...p,
              stageIndex: nextStage,
              state:
                nextStage === STAGES.length - 1
                  ? "delivered"
                  : nextStage === 2
                  ? "injecting"
                  : p.state,
            };
          })
          .filter(Boolean) as Packet[]
      );
    }, 850 / speed);

    return () => {
      clearInterval(createTimer);
      clearInterval(advanceTimer);
    };
  }, [playing, speed]);

  return { packets, deliveredCount } as const;
}

function useTerminal(lines: string[]) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    termRef.current = new Terminal({
      convertEol: true,
      disableStdin: true,
      fontFamily: "var(--mono)",
      fontSize: 13,
      theme: {
        background: "#06060a",
        foreground: "#d9e7ff",
        cursor: "#6cf0ff",
      },
    });
    if (hostRef.current) {
      termRef.current.open(hostRef.current);
    }
    return () => termRef.current?.dispose();
  }, []);

  useEffect(() => {
    if (!termRef.current) return;
    termRef.current.reset();
    lines.forEach((l) => termRef.current?.writeln(l));
  }, [lines]);

  return hostRef;
}

export default function App() {
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "relay-pty daemon connected",
    "listening on /tmp/relay-pty.sock",
    "awaiting messages…",
  ]);

  const { packets } = usePacketEngine(speed, playing);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setTerminalLines((prev) =>
        [...prev.slice(-10), `inject:${randomPick(sampleBodies)} ✓`]
      );
    }, 1800 / speed);
    return () => clearInterval(timer);
  }, [playing, speed]);

  const terminalHost = useTerminal(terminalLines);

  const metrics = useMemo(() => {
    const queueDepth = packets.filter((p) => p.stageIndex === 0).length;
    const inflight = packets.filter((p) => p.stageIndex > 0 && p.stageIndex < STAGES.length - 1).length;
    const delivered = terminalLines.length;
    const latencyMs = 120 + Math.round(Math.random() * 40);
    return { queueDepth, inflight, delivered, latencyMs };
  }, [packets, terminalLines]);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="pill">relay-pty live explainer</div>
          <h1>See every hop from queue to PTY</h1>
          <p>
            Animated walkthrough of the agent-relay + relay-pty stack. Watch
            packets jump across the daemon, sockets, agents, and terminal while
            a simulated log stream mirrors the real protocol.
          </p>
          <div className="actions">
            <button className="btn primary" onClick={() => setPlaying((p) => !p)}>
              {playing ? "Pause stream" : "Resume stream"}
            </button>
            <button className="btn ghost" onClick={() => setTerminalLines(["replay loaded"])}>
              Load replay snapshot
            </button>
          </div>
          <div className="controls">
            <label>
              Speed
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
              <span>{speed.toFixed(1)}x</span>
            </label>
            <div className="chips">
              <span className="chip">TypeScript everywhere</span>
              <span className="chip">Fastify + WebSocket</span>
              <span className="chip">Framer Motion + D3 lite</span>
            </div>
          </div>
        </div>
        <div className="mini-panel">
          <h3>Live health</h3>
          <div className="stat-grid">
            <Metric label="Queue depth" value={metrics.queueDepth} suffix="msgs" />
            <Metric label="In flight" value={metrics.inflight} suffix="msgs" />
            <Metric label="Echo latency" value={metrics.latencyMs} suffix="ms" />
            <Metric label="Delivered" value={metrics.delivered} suffix="lines" />
          </div>
          <p className="caption">data simulated for the animation — wire to real daemon later</p>
        </div>
      </header>

      <section className="board">
        <div className="panel flow">
          <div className="panel-head">
            <div>
              <h3>Relay flow</h3>
              <p>Watch packets hop across the relay-pty lifecycle.</p>
            </div>
            <div className="legend">
              <span className="dot" /> live token
              <span className="legend-line" /> stage lane
            </div>
          </div>
          <div className="lanes">
            {STAGES.map((stage) => (
              <div key={stage.id} className="lane">
                <div className="lane-label">
                  <span>{stage.label}</span>
                  <small>{stage.hint}</small>
                </div>
                <div className="lane-line" style={{ background: `linear-gradient(90deg, hsla(${stage.hue},80%,60%,0.4), transparent)` }} />
              </div>
            ))}
            <div className="packets">
              <AnimatePresence>
                {packets.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    className="packet"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: p.stageIndex * 180,
                      background: `linear-gradient(135deg, hsla(${p.hue},80%,65%,1), hsla(${p.hue + 40},80%,60%,0.9))`,
                    }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    transition={{ type: "spring", stiffness: 140, damping: 18 }}
                    style={{ top: `${(idx % 5) * 38}px` }}
                    title={p.label}
                  >
                    <span className="packet-id">{p.id}</span>
                    <span className="packet-label">{p.label}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="panel terminal">
          <div className="panel-head">
            <div>
              <h3>PTY echo stream</h3>
              <p>xterm.js surface that mirrors what the agent would see.</p>
            </div>
            <span className="chip">relay-pty</span>
          </div>
          <div className="terminal-shell" ref={terminalHost} />
        </div>
      </section>

      <section className="board two-col">
        <div className="panel stack">
          <div className="panel-head">
            <h3>Stack decisions</h3>
            <p>Unified plan from the agent swarm.</p>
          </div>
          <ul className="bullet-list">
            <li><strong>Frontend</strong>: React + TypeScript + Vite, Framer Motion animations, D3/Visx for sparkline, Tailwind tokens.</li>
            <li><strong>Live transport</strong>: Fastify WebSocket/SSE + REST replay; Redis fanout; Postgres/SQLite snapshots.</li>
            <li><strong>UX</strong>: Three-lane animation, terminal pane, scrubber/replay, hover-to-pin payloads, secure side sheet.</li>
            <li><strong>Security</strong>: JWT per session, allowlist redaction + blur-on-hover, rate limits, signed payloads.</li>
            <li><strong>Ops</strong>: pino logs, Prometheus metrics, health endpoints; feature flag for replay storage.</li>
          </ul>
        </div>

        <div className="panel risks">
          <div className="panel-head">
            <h3>Risks & guards</h3>
            <p>Top blockers called out by the agents.</p>
          </div>
          <ul className="risk-grid">
            <li>
              <span>Data leakage</span>
              <small>Enforce server-side redaction, client blur, hashed IDs.</small>
            </li>
            <li>
              <span>UI perf spikes</span>
              <small>Sliding window + sampling, backpressure on WS, binary frames.</small>
            </li>
            <li>
              <span>Schema drift</span>
              <small>Versioned event contract + fallback parser + linters.</small>
            </li>
          </ul>
        </div>
      </section>

      <section className="panel timeline">
        <div className="panel-head">
          <div>
            <h3>Logic timeline</h3>
            <p>How the relay-pty protocol executes end-to-end.</p>
          </div>
          <span className="chip">replay-ready</span>
        </div>
        <div className="timeline-grid">
          {timeline.map((item, idx) => (
            <div key={item.title} className="timeline-card">
              <div className="timeline-dot" />
              <div className="timeline-body">
                <p className="timeline-step">{`Step ${idx + 1}`}</p>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="metric">
      <p>{label}</p>
      <div>
        <span>{value}</span>
        {suffix && <small>{suffix}</small>}
      </div>
    </div>
  );
}
