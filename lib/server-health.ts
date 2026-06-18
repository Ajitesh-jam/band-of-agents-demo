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

/** Sources that should mark the server unhealthy until explicit recover. */
const CRASH_SOURCES = new Set([
  'route-error',
  'global-error',
  'uncaughtException',
  'unhandledRejection',
  'build-error',
  'compile-error',
  'file-error',
])

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

/** Re-read persisted state so /api/health sees crashes written by other routes/workers. */
function syncStateFromDisk() {
  state = loadState()
}

function touch() {
  saveState(state)
}

function shouldEscalateToCrash(source: string, details?: { file?: string }) {
  return CRASH_SOURCES.has(source) || Boolean(details?.file)
}

export function reportServerError(
  source: string,
  message: string,
  details?: { stack?: string; file?: string }
) {
  syncStateFromDisk()
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
  if (shouldEscalateToCrash(source, details) && !state.crash?.active) {
    state.crash = {
      active: true,
      timestamp: new Date().toISOString(),
      reason: message,
      errorCode: details?.file ? 'FILE_ERROR' : 'RUNTIME_ERROR',
    }
  }
  touch()
}

export function setServerCrash(
  reason = 'Fatal application crash',
  errorCode = 'FATAL_APP_CRASH'
): CrashState {
  syncStateFromDisk()
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
  syncStateFromDisk()
  state.crash = null
  touch()
}

export function clearServerErrors() {
  syncStateFromDisk()
  state.errors = []
  touch()
}

export function getServerHealthState() {
  syncStateFromDisk()
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
  syncStateFromDisk()
  return state.crash?.active !== true && state.errors.length === 0
}

const RECOVERABLE_ERROR_CODES = new Set([
  'APPLICATION_ERROR',
  'COMPILE_ERROR',
  'FILE_ERROR',
  'RUNTIME_ERROR',
])

export function markApplicationFailure(
  message: string,
  errorCode = 'APPLICATION_ERROR'
) {
  syncStateFromDisk()
  if (state.crash?.active && !RECOVERABLE_ERROR_CODES.has(state.crash.errorCode)) {
    return
  }
  state.crash = {
    active: true,
    timestamp: new Date().toISOString(),
    reason: message,
    errorCode,
  }
  const alreadyLogged = state.errors.some(
    (entry) => entry.source === 'application-health' && entry.message === message
  )
  if (!alreadyLogged) {
    state.errors.push({
      source: 'application-health',
      message,
      timestamp: new Date().toISOString(),
    })
  }
  touch()
}

export function clearRecoverableApplicationFailure() {
  syncStateFromDisk()
  if (state.crash?.active && RECOVERABLE_ERROR_CODES.has(state.crash.errorCode)) {
    state.crash = null
    state.errors = state.errors.filter((entry) => entry.source !== 'application-health')
    touch()
  }
}

export function buildHealthPayload() {
  syncStateFromDisk()
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
