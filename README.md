# Band of Agents — Hackathon Demo

A Next.js demo app for the **Band of Agents** hackathon. It showcases an animated multi-agent dashboard with health monitoring, logging, agent-level error injection, and a fatal crash API designed for testing autonomous agent recovery.

**Live site:** https://ajitesh-jam.github.io/band-of-agents-demo/

![License](https://img.shields.io/badge/License-MIT-blue)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

---

## Features

- **Animated agent dashboard** — 5 agents (Atlas, Echo, Nova, Flux, Iris) with live motion
- **Health monitoring** — per-agent CPU, memory, response time, and system status
- **Activity logs** — in-browser logging with info / warn / error levels
- **Deployment logs** — build and GitHub Pages deploy history
- **Agent error injection** — simulate a single agent failure and recover it
- **Fatal crash API** — take the entire app down until recovered (for Band of Agents testing)
- **Static HTTP endpoints** — curl-friendly JSON files on GitHub Pages
- **Console API** — full `bandAPI` object available in the browser devtools

---

## Project Structure

```
band-of-agents-demo/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page (wraps Dashboard in CrashGuard)
│   └── globals.css
├── components/
│   ├── dashboard.tsx       # Main UI + control buttons
│   ├── crash-guard.tsx     # Crash detection & "Application Down" screen
│   └── ui/
├── lib/
│   ├── agents.ts           # Agent manager (health, inject/resolve errors)
│   ├── logger.ts           # In-browser activity logger
│   ├── deployment-logs.ts  # Build/deploy log store
│   ├── crash-state.ts      # Persistent crash flag (localStorage)
│   └── band-api.ts         # Unified bandAPI (console + fetch helpers)
├── public/api/
│   ├── health.json         # Static health snapshot (regenerated on deploy)
│   ├── logs.json           # Static activity log snapshot
│   ├── deployment-logs.json
│   ├── inject-error.json   # Crash API documentation
│   ├── inject-error.html   # HTTP trigger to crash the app
│   └── recover.html        # HTTP trigger to recover the app
├── scripts/
│   ├── generate-api-files.mjs  # Regenerates public/api/*.json before build
│   └── preview-pages.mjs       # Local preview with GitHub Pages base path
├── next.config.mjs         # Static export + /band-of-agents-demo base path
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the dashboard runs without the GitHub Pages base path locally.

### Build for GitHub Pages

```bash
npm run build:pages
```

This generates static API JSON files and exports the app to `out/` with base path `/band-of-agents-demo`.

### Preview the GitHub Pages build locally

```bash
npm run build:pages
npm run preview:pages
```

Open http://localhost:3000/band-of-agents-demo/ (auto-fallback to next port if 3000 is busy).

### Deploy to GitHub Pages

```bash
npm run deploy
```

Then in GitHub repo **Settings → Pages**:
- **Source:** Deploy from a branch
- **Branch:** `gh-pages` → `/ (root)`

---

## API Overview

There are **two kinds of APIs**:

| Type | Where | Use case |
|------|-------|----------|
| **Live (console)** | `bandAPI.*` in browser | Real-time metrics, inject errors, crash/recover |
| **Static (HTTP)** | `/api/*.json` and `/api/*.html` | curl, fetch, external monitors, Band of Agents |

> **Note:** GitHub Pages is static-only — there is no server runtime. Live APIs run in the browser; static JSON files are snapshots regenerated on each deploy.

**Base URL (production):** `https://ajitesh-jam.github.io/band-of-agents-demo`

---

## Static HTTP Endpoints

These work with `curl`, `fetch`, or any HTTP client.

### Health

```bash
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/health.json
```

Returns agent list, system status, and metrics snapshot from last deploy.

### Activity Logs

```bash
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/logs.json
```

Returns system activity logs snapshot.

### Deployment Logs

```bash
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/deployment-logs.json
```

Returns build and GitHub Pages deployment history.

### Inject Error (API docs)

```bash
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/inject-error.json
```

Returns documentation for all crash/recover endpoints.

### Crash the App (HTTP trigger)

```bash
# Requires a browser to execute JS — use headless browser for agents
open https://ajitesh-jam.github.io/band-of-agents-demo/api/inject-error.html
```

Or via query param:

```
https://ajitesh-jam.github.io/band-of-agents-demo/?injectError=true
```

### Recover the App (HTTP trigger)

```bash
open https://ajitesh-jam.github.io/band-of-agents-demo/api/recover.html
```

Or:

```
https://ajitesh-jam.github.io/band-of-agents-demo/?recover=true
```

---

## Console API (`bandAPI`)

Open the browser devtools console (F12) on the live site. All methods are available as `window.bandAPI`.

### Health

```javascript
// Live health — returns real-time agent metrics
bandAPI.getHealth()

// Static health snapshot via fetch
await bandAPI.fetchHealth()

// Check if app is in crashed state
bandAPI.isCrashed()
```

**Live `getHealth()` response (healthy):**
```json
{
  "status": "ok",
  "timestamp": "2026-06-19T...",
  "systemHealth": {
    "status": "healthy",
    "agents": { "healthy": 5, "degraded": 0, "error": 0 },
    "metrics": { "avgCpu": 15.2, "avgMemory": 22.1, "avgResponseTime": 87.4 }
  },
  "agents": [
    {
      "id": "agent-1",
      "name": "Atlas",
      "status": "healthy",
      "metrics": { "cpu": 12.3, "memory": 18.5, "responseTime": 72.1, "tasksCompleted": 542, "uptime": 12345 },
      "lastUpdated": "2026-06-19T..."
    }
  ]
}
```

**Live `getHealth()` response (crashed):**
```json
{
  "status": "error",
  "systemHealth": { "status": "error", "agents": { "healthy": 0, "degraded": 0, "error": 5 } },
  "crash": {
    "active": true,
    "timestamp": "2026-06-19T...",
    "reason": "Fatal error injected via ...",
    "errorCode": "FATAL_APP_CRASH"
  },
  "agents": []
}
```

---

### Logs

```javascript
// Live activity logs (in-browser logger)
bandAPI.getLogs()              // default limit: 100
bandAPI.getLogs(50)            // custom limit
bandAPI.getLogs(50, 'error')   // filter by level: info | warn | error

// Static logs snapshot via fetch
await bandAPI.fetchLogs()
```

---

### Deployment Logs

```javascript
// Live deployment/build logs
bandAPI.getDeploymentLogs()
bandAPI.getDeploymentLogs(20)  // custom limit

// Static snapshot via fetch
await bandAPI.fetchDeploymentLogs()
```

---

### Agent Error Injection

Inject an error into a **single agent** (app keeps running):

```javascript
// Random agent
bandAPI.injectError()

// Specific agent by ID
bandAPI.injectError('agent-1')
bandAPI.injectError('agent-3')

// Resolve a specific agent error
bandAPI.resolveError('agent-1')
```

**Agent IDs:**

| ID | Name |
|----|------|
| `agent-1` | Atlas |
| `agent-2` | Echo |
| `agent-3` | Nova |
| `agent-4` | Flux |
| `agent-5` | Iris |

After injection, `getHealth()` shows the agent with `"status": "error"` and degraded system metrics.

---

### Fatal Error / Crash the App

Crash the **entire application** — shows a red "Application Down" screen until recovered. State persists in `localStorage` across page reloads.

```javascript
// Crash via console
bandAPI.injectFatalError()
bandAPI.injectFatalError('Custom crash reason for testing')

// Crash via HTTP redirect
bandAPI.injectFatalErrorViaHttp()

// Recover
bandAPI.recover()

// Check crash API docs
await bandAPI.fetchInjectErrorInfo()
```

**HTTP crash triggers (for Band of Agents):**

| Method | URL | Effect |
|--------|-----|--------|
| GET | `/api/inject-error.html` | Sets crash flag, redirects to app (shows down screen) |
| GET | `/?injectError=true` | Same as above via query param |
| GET | `/api/recover.html` | Clears crash flag, restores app |
| GET | `/?recover=true` | Same as above via query param |

**Dashboard button:** Click the red **Crash App** button.

> Plain `curl` to the inject URL will not crash the app — it requires a browser to execute the JavaScript. Use a headless browser or Playwright/Puppeteer for automated agent testing.

---

## Dashboard Controls

| Button | API called | Description |
|--------|-----------|-------------|
| Check Health | `bandAPI.getHealth()` | Live system + agent metrics |
| View Logs | `bandAPI.getLogs(50)` | Activity logs panel |
| Deployment Logs | `bandAPI.getDeploymentLogs()` | Build/deploy history |
| Crash App | `bandAPI.injectFatalError()` | Fatal crash with confirmation |

---

## Testing with Band of Agents

Use this workflow to verify your agents can detect and recover from failures:

### 1. Verify the app is healthy

```bash
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/health.json
# Or in browser console: bandAPI.getHealth()
```

### 2. Inject a single agent error

```javascript
bandAPI.injectError('agent-2')
bandAPI.getHealth()  // agent-2 status: "error"
```

### 3. Recover the agent

```javascript
bandAPI.resolveError('agent-2')
bandAPI.getHealth()  // all agents healthy again
```

### 4. Crash the entire app

Visit in a browser (or headless browser):
```
https://ajitesh-jam.github.io/band-of-agents-demo/api/inject-error.html
```

Expected result: red **Application Down** screen with error code `FATAL_APP_CRASH`.

### 5. Verify agents detect the outage

- Page content shows "Application Down" instead of the dashboard
- `bandAPI.getHealth()` returns `{ "status": "error", "crash": {...} }`
- `bandAPI.isCrashed()` returns `true`

### 6. Recover the app

Visit:
```
https://ajitesh-jam.github.io/band-of-agents-demo/api/recover.html
```

Or in console (if you can still access it on the crash screen):
```javascript
bandAPI.recover()
```

---

## Quick Reference

```javascript
// ── Health ──────────────────────────────────────────
bandAPI.getHealth()
await bandAPI.fetchHealth()
bandAPI.isCrashed()

// ── Logs ────────────────────────────────────────────
bandAPI.getLogs()
bandAPI.getLogs(50, 'error')
await bandAPI.fetchLogs()

// ── Deployment Logs ─────────────────────────────────
bandAPI.getDeploymentLogs()
await bandAPI.fetchDeploymentLogs()

// ── Agent Errors ────────────────────────────────────
bandAPI.injectError()           // random agent
bandAPI.injectError('agent-1')  // specific agent
bandAPI.resolveError('agent-1')

// ── Fatal Crash / Recover ───────────────────────────
bandAPI.injectFatalError()
bandAPI.injectFatalError('OOM kill simulated')
bandAPI.injectFatalErrorViaHttp()
bandAPI.recover()
await bandAPI.fetchInjectErrorInfo()
```

```bash
# ── Static HTTP (curl) ──────────────────────────────
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/health.json
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/logs.json
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/deployment-logs.json
curl https://ajitesh-jam.github.io/band-of-agents-demo/api/inject-error.json
```

---

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Standard Next.js build |
| `npm run build:pages` | Generate API JSON + static export for GitHub Pages |
| `npm run preview:pages` | Preview the GitHub Pages build locally |
| `npm run deploy` | Build and push `out/` to the `gh-pages` branch |

---

## Customization

### Change agents

Edit `lib/agents.ts` — update the `AGENT_NAMES` array:

```typescript
const AGENT_NAMES = ['Atlas', 'Echo', 'Nova', 'Flux', 'Iris']
```

### Regenerate static API files

```bash
node scripts/generate-api-files.mjs
```

This updates `public/api/*.json` before the next build/deploy.

---

## Browser Support

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

---

## License

MIT — free to use for the Band of Agents hackathon.

---

## Band of Agents Integration

The Band **watchdog** polls these endpoints on your hosted URL:

| Endpoint | Purpose |
|----------|---------|
| `/api/health.json` | Primary health signal (`status: "ok"` = healthy) |
| `/api/logs.json` | Activity logs attached to incidents |
| `/api/deployment-logs.json` | Build/deploy logs attached to incidents |

When health fails, the watchdog opens an incident room and includes log payloads for planner/coder.

### Trigger a test outage (detectable by watchdog)

**Option A — Band agent tools (recommended):**  
Set `GITHUB_TOKEN` + `DEMO_APP_REPO=https://github.com/Ajitesh-jam/band-of-agents-demo.git` in Band `.env`, then the coder can call `inject_fatal_error` which patches `api/health.json` on the `gh-pages` branch to `status: "error"`.

**Option B — Browser UI crash:**  
Visit `/api/inject-error.html` — crashes the UI for that browser only. Watchdog will **not** detect this unless `health.json` is also patched (use Option A).

### Recovery

Band **coder** and **reviewer** call `restore_service`, which:
1. Patches `api/health.json` back to `status: "ok"` on `gh-pages` (when `GITHUB_TOKEN` is set)
2. Hits `/api/recover.html` to clear browser crash state

### Band `.env` example

```bash
HOSTED_APP_URL=https://ajitesh-jam.github.io/band-of-agents-demo
DEMO_APP_URL=https://ajitesh-jam.github.io/band-of-agents-demo
DEMO_APP_REPO=https://github.com/Ajitesh-jam/band-of-agents-demo.git
GITHUB_TOKEN=ghp_...
```

---

Made for the **Band of Agents Hackathon** — use the APIs above to test whether your agent band can monitor, detect, and recover from demo app failures.
