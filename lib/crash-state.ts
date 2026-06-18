export const CRASH_STORAGE_KEY = 'band-app-crash'

export interface CrashRecord {
  active: boolean
  timestamp: string
  reason: string
  errorCode: string
}

export function getCrashRecord(): CrashRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CRASH_STORAGE_KEY)
    if (!raw) return null
    const record = JSON.parse(raw) as CrashRecord
    return record.active ? record : null
  } catch {
    return null
  }
}

export function isAppCrashed(): boolean {
  return getCrashRecord() !== null
}

export function setAppCrash(
  reason = 'Fatal error injected via API',
  errorCode = 'FATAL_APP_CRASH'
): CrashRecord {
  const record: CrashRecord = {
    active: true,
    timestamp: new Date().toISOString(),
    reason,
    errorCode,
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(CRASH_STORAGE_KEY, JSON.stringify(record))
  }
  return record
}

export function clearAppCrash() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CRASH_STORAGE_KEY)
  }
}

export function handleCrashQueryParams(): 'inject' | 'recover' | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  if (params.get('injectError') === 'true') return 'inject'
  if (params.get('recover') === 'true') return 'recover'
  return null
}
