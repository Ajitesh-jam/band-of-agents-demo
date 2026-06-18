import { agentManager } from './agents'
import { logger } from './logger'
import { addDeploymentLog, getDeploymentLogs } from './deployment-logs'
import {
  clearAppCrash,
  getCrashRecord,
  isAppCrashed,
  setAppCrash,
} from './crash-state'

const BASE_PATH =
  typeof window !== 'undefined'
    ? (document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') ??
        (window.location.pathname.startsWith('/band-of-agents-demo')
          ? '/band-of-agents-demo'
          : ''))
    : '/band-of-agents-demo'

function apiUrl(path: string) {
  return `${BASE_PATH}${path}`
}

function healthApiPath() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return apiUrl('/api/health')
    }
  }
  return apiUrl('/api/health.json')
}

export const bandAPI = {
  /** Live agent + system health (in-browser) */
  getHealth() {
    if (isAppCrashed()) {
      const crash = getCrashRecord()
      addDeploymentLog('Health check failed — app is crashed', 'error', 'system')
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        systemHealth: {
          status: 'error',
          agents: { healthy: 0, degraded: 0, error: 5 },
          metrics: { avgCpu: 100, avgMemory: 100, avgResponseTime: 9999 },
        },
        crash,
        agents: [],
      }
    }

    const agents = agentManager.getAgents()
    const systemHealth = agentManager.getSystemHealth()
    addDeploymentLog('Health check requested', 'info', 'system')

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      systemHealth,
      agents: agents.map((a) => ({
        id: a.id,
        name: a.name,
        status: a.status,
        metrics: a.metrics,
        lastUpdated: a.lastUpdated.toISOString(),
      })),
    }
  },

  /** Activity logs from the in-browser logger */
  getLogs(limit = 100, level?: string) {
    const logs = logger.getLogs(limit, level?.toLowerCase())
    addDeploymentLog(`Logs fetched (limit=${limit})`, 'info', 'system')

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      count: logs.length,
      logs: logs.map((log) => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      })),
    }
  },

  /** Build & GitHub Pages deployment logs */
  getDeploymentLogs(limit = 50) {
    const logs = getDeploymentLogs(limit)
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      count: logs.length,
      logs,
    }
  },

  /** Fetch health snapshot (dynamic in dev, static on GitHub Pages) */
  async fetchHealth() {
    const res = await fetch(healthApiPath(), { cache: 'no-store' })
    const body = await res.json()
    if (!res.ok) {
      return { ...body, status: body.status ?? 'error', httpStatus: res.status }
    }
    return body
  },

  /** Fetch static logs snapshot */
  async fetchLogs() {
    const res = await fetch(apiUrl('/api/logs.json'))
    if (!res.ok) throw new Error('Failed to fetch logs')
    return res.json()
  },

  /** Fetch static deployment logs snapshot */
  async fetchDeploymentLogs() {
    const res = await fetch(apiUrl('/api/deployment-logs.json'))
    if (!res.ok) throw new Error('Failed to fetch deployment logs')
    return res.json()
  },

  injectError(agentId?: string) {
    if (agentId) {
      agentManager.injectError(agentId)
      addDeploymentLog(`Error injected into agent ${agentId}`, 'warn', 'system')
    } else {
      const id = agentManager.injectRandomError()
      addDeploymentLog(`Random error injected into agent ${id}`, 'warn', 'system')
    }
    return this.getHealth()
  },

  resolveError(agentId: string) {
    agentManager.resolveError(agentId)
    addDeploymentLog(`Error resolved for agent ${agentId}`, 'success', 'system')
    return this.getHealth()
  },

  /** Crash the entire app (persists until recover is called) */
  injectFatalError(reason = 'Fatal error injected via bandAPI.injectFatalError()') {
    const record = setAppCrash(reason)
    logger.error('Fatal application crash injected', { reason, errorCode: record.errorCode })
    addDeploymentLog(`FATAL: ${reason}`, 'error', 'system')
    void fetch(apiUrl('/api/crash'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, errorCode: record.errorCode }),
      keepalive: true,
    }).catch(() => {})
    window.location.reload()
    return { success: true, crashed: true, ...record }
  },

  /** Recover from a fatal crash */
  recover() {
    clearAppCrash()
    void fetch(apiUrl('/api/crash'), { method: 'DELETE', keepalive: true }).catch(() => {})
    addDeploymentLog('Application recovered from fatal crash', 'success', 'system')
    logger.info('Application recovered from fatal crash')
    window.location.href = apiUrl('/')
    return { success: true, recovered: true, timestamp: new Date().toISOString() }
  },

  isCrashed() {
    return isAppCrashed()
  },

  /** Trigger crash via HTTP (navigates to inject-error endpoint) */
  injectFatalErrorViaHttp() {
    window.location.href = apiUrl('/api/inject-error.html')
    return { success: true, redirecting: true }
  },

  /** Fetch inject-error API documentation */
  async fetchInjectErrorInfo() {
    const res = await fetch(apiUrl('/api/inject-error.json'))
    if (!res.ok) throw new Error('Failed to fetch inject-error info')
    return res.json()
  },
}

export type BandAPI = typeof bandAPI

declare global {
  interface Window {
    bandAPI: BandAPI
  }
}
