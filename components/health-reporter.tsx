'use client'

import { useEffect } from 'react'
import { getCrashRecord } from '@/lib/crash-state'

function reportClientError(payload: {
  source: string
  message: string
  stack?: string
  file?: string
}) {
  void fetch('/api/report-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}

function syncCrashToServer() {
  const crash = getCrashRecord()
  if (!crash) return

  void fetch('/api/crash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason: crash.reason, errorCode: crash.errorCode }),
    keepalive: true,
  }).catch(() => {})
}

export function HealthReporter() {
  useEffect(() => {
    syncCrashToServer()

    const onError = (event: ErrorEvent) => {
      reportClientError({
        source: 'window.error',
        message: event.message || 'Unknown client error',
        stack: event.error?.stack,
        file: event.filename,
      })
    }

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      reportClientError({
        source: 'window.unhandledrejection',
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      })
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  return null
}
