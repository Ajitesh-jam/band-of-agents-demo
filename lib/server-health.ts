import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export type HealthError = {
  source: string
  message: string
  stack?: string
  file?: string
  timestamp: string
}

export type CrashState = {
  active: boolean
  timestamp: string
  reason: string
  errorCode: string
}

type ServerHealthState = {
  crash: CrashState | null
  errors: HealthError[]
}

const STATE_DIR = join(process.cwd(), '.band')
const STATE_FILE = join(STATE_DIR, 'server-health.json')

const MAX_ERRORS = 20

function defaultState(): ServerHealthState {
  return { crash: null, errors: [] }
}

function loadState(): ServerHealthState {
  try {
    if (!existsSync(STATE_FILE)) return defaultState()
    const parsed = JSON.parse(readFileSync(STATE_FILE, 'utf8')) as ServerHealthState
    return {
      crash: parsed.crash?.active ? parsed.crash : null,
      errors: Array.isArray(parsed.errors) ? parsed.errors.slice(-MAX_ERRORS) : [],
    }
  } catch {
    return defaultState()
  }
}

function saveState(state: ServerHealthState) {
  mkdirSync(STATE_DIR, { recursive: true })
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

let state = loadState()

function touch() {
  saveState(state)
}

export function reportServerError(
  source: string,
  message: string,
  details?: { stack?: string; file?: string }
) {
  state.errors.push({
    source,
    message,
    stack: details?.stack,
    file: details?.file,
    timestamp: new Date().toISOString(),
  })
  if (state.errors.length > MAX_ERRORS) {
    state.errors = state.errors.slice(-MAX_ERRORS)
  }
  touch()
}

export function setServerCrash(
  reason = 'Fatal application crash',
  errorCode = 'FATAL_APP_CRASH'
): CrashState {
  state.crash = {
    active: true,
    timestamp: new Date().toISOString(),
    reason,
    errorCode,
  }
  touch()
  return state.crash
}

export function clearServerCrash() {
  state.crash = null
  touch()
}

export function clearServerErrors() {
  state.errors = []
  touch()
}

export function getServerHealthState() {
  return {
    crash: state.crash,
    errors: [...state.errors],
  }
}

function readHealthyTemplate(): Record<string, unknown> {
  try {
    const raw = readFileSync(join(process.cwd(), 'public', 'api', 'health.json'), 'utf8')
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return {
      status: 'ok',
      systemHealth: {
        status: 'healthy',
        agents: { healthy: 5, degraded: 0, error: 0 },
        metrics: { avgCpu: 0, avgMemory: 0, avgResponseTime: 0 },
      },
      agents: [],
    }
  }
}

export function isServerHealthy() {
  const now = Date.now()
  state.errors = state.errors.filter(
    (entry) => now - new Date(entry.timestamp).getTime() < 120_000
  )
  return state.crash?.active !== true && state.errors.length === 0
}

export function buildHealthPayload() {
  const timestamp = new Date().toISOString()
  const crashed = state.crash?.active === true
  const hasErrors = state.errors.length > 0

  if (crashed || hasErrors) {
    const primaryError = state.errors.at(-1)
    const reason =
      state.crash?.reason ??
      primaryError?.message ??
      'Application health check failed'

    return {
      status: 'error',
      timestamp,
      systemHealth: {
        status: 'error',
        agents: { healthy: 0, degraded: 0, error: 5 },
        metrics: { avgCpu: 100, avgMemory: 100, avgResponseTime: 9999 },
      },
      crash: state.crash ?? {
        active: true,
        timestamp,
        reason,
        errorCode: 'RUNTIME_ERROR',
      },
      errors: state.errors,
      active_fault: state.crash?.errorCode ?? primaryError?.source ?? 'application_error',
      failure_reason: state.crash?.errorCode ?? primaryError?.source,
    }
  }

  const template = readHealthyTemplate()
  return {
    ...template,
    status: 'ok',
    timestamp,
    systemHealth: {
      ...(template.systemHealth as Record<string, unknown>),
      status: 'healthy',
    },
  }
}
