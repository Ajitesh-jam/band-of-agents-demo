import {
  clearRecoverableApplicationFailure,
  markApplicationFailure,
} from '@/lib/server-health'

const FAILURE_PATTERNS = [
  /failed to compile/i,
  /build error/i,
  /application error/i,
  /module not found/i,
  /syntax error/i,
  /unexpected token/i,
]

export async function probeApplicationHealth(origin: string) {
  try {
    const response = await fetch(`${origin}/`, {
      cache: 'no-store',
      headers: { 'x-band-health-probe': '1' },
    })
    const body = await response.text()

    if (response.status >= 500) {
      markApplicationFailure(`Home page returned HTTP ${response.status}`)
      return
    }

    if (FAILURE_PATTERNS.some((pattern) => pattern.test(body))) {
      markApplicationFailure('Application failed to compile or render')
      return
    }

    clearRecoverableApplicationFailure()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    markApplicationFailure(message)
  }
}
