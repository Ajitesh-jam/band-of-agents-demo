import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT_DIR = join(import.meta.dirname, '..', 'public', 'api')
const timestamp = new Date().toISOString()

const agents = ['Atlas', 'Echo', 'Nova', 'Flux', 'Iris'].map((name, i) => ({
  id: `agent-${i + 1}`,
  name,
  status: 'healthy',
  metrics: {
    cpu: +(Math.random() * 30).toFixed(1),
    memory: +(Math.random() * 40).toFixed(1),
    responseTime: +(Math.random() * 100 + 50).toFixed(1),
    tasksCompleted: Math.floor(Math.random() * 1000) + 100,
    uptime: Date.now(),
  },
}))

const health = {
  status: 'ok',
  timestamp,
  systemHealth: {
    status: 'healthy',
    agents: { healthy: 5, degraded: 0, error: 0 },
    metrics: {
      avgCpu: +(agents.reduce((s, a) => s + a.metrics.cpu, 0) / agents.length).toFixed(1),
      avgMemory: +(agents.reduce((s, a) => s + a.metrics.memory, 0) / agents.length).toFixed(1),
      avgResponseTime: +(
        agents.reduce((s, a) => s + a.metrics.responseTime, 0) / agents.length
      ).toFixed(1),
    },
  },
  agents,
}

const logs = {
  status: 'ok',
  timestamp,
  count: 4,
  logs: [
    { id: '1', timestamp, level: 'info', message: 'Agents initialized', context: { count: 5 } },
    {
      id: '2',
      timestamp: new Date(Date.now() - 30_000).toISOString(),
      level: 'info',
      message: 'Static API files generated for GitHub Pages',
      context: { source: 'build' },
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 60_000).toISOString(),
      level: 'info',
      message: 'Health endpoint available at /api/health.json',
      context: { source: 'deploy' },
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 90_000).toISOString(),
      level: 'info',
      message: 'Deployment logs available at /api/deployment-logs.json',
      context: { source: 'deploy' },
    },
  ],
}

const deploymentLogs = {
  status: 'ok',
  timestamp,
  count: 5,
  logs: [
    {
      id: 'd1',
      timestamp,
      level: 'success',
      source: 'deploy',
      message: 'gh-pages deploy completed successfully',
    },
    {
      id: 'd2',
      timestamp: new Date(Date.now() - 45_000).toISOString(),
      level: 'info',
      source: 'build',
      message: 'Next.js static export written to out/',
    },
    {
      id: 'd3',
      timestamp: new Date(Date.now() - 90_000).toISOString(),
      level: 'info',
      source: 'pages',
      message: 'Published to https://ajitesh-jam.github.io/band-of-agents-demo/',
    },
    {
      id: 'd4',
      timestamp: new Date(Date.now() - 120_000).toISOString(),
      level: 'info',
      source: 'build',
      message: 'Base path set to /band-of-agents-demo/',
    },
    {
      id: 'd5',
      timestamp: new Date(Date.now() - 150_000).toISOString(),
      level: 'info',
      source: 'system',
      message: 'Static API endpoints generated: health, logs, deployment-logs',
    },
  ],
}

const injectError = {
  status: 'ok',
  timestamp,
  description: 'Inject a fatal error that crashes the entire application until recovered',
  endpoints: {
    inject: {
      method: 'GET',
      url: 'https://ajitesh-jam.github.io/band-of-agents-demo/api/inject-error.html',
      effect: 'Crashes the app UI (localStorage) — browser only',
    },
    injectHealthPatch: {
      method: 'PATCH via GitHub API',
      note: 'Band agents call trigger_fatal_crash to patch gh-pages api/health.json to status error (watchdog-detectable)',
    },
    recover: {
      method: 'GET',
      url: 'https://ajitesh-jam.github.io/band-of-agents-demo/api/recover.html',
      effect: 'Clears UI crash state and restores the app',
    },
    recoverHealthPatch: {
      method: 'PATCH via GitHub API',
      note: 'Band coder/reviewer restore_service patches gh-pages api/health.json back to status ok',
    },
    injectQueryParam: {
      method: 'GET',
      url: 'https://ajitesh-jam.github.io/band-of-agents-demo/?injectError=true',
      effect: 'Same as inject endpoint via query parameter',
    },
    recoverQueryParam: {
      method: 'GET',
      url: 'https://ajitesh-jam.github.io/band-of-agents-demo/?recover=true',
      effect: 'Same as recover endpoint via query parameter',
    },
  },
  console: {
    injectFatalError: 'bandAPI.injectFatalError()',
    recover: 'bandAPI.recover()',
    checkCrashed: 'bandAPI.isCrashed()',
  },
}

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(join(OUT_DIR, 'health.json'), JSON.stringify(health, null, 2))
writeFileSync(join(OUT_DIR, 'logs.json'), JSON.stringify(logs, null, 2))
writeFileSync(join(OUT_DIR, 'deployment-logs.json'), JSON.stringify(deploymentLogs, null, 2))
writeFileSync(join(OUT_DIR, 'inject-error.json'), JSON.stringify(injectError, null, 2))

console.log('Generated public/api/health.json, logs.json, deployment-logs.json, inject-error.json')
