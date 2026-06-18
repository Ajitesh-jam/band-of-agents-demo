'use client'

import { useEffect, useState } from 'react'
import {
  clearAppCrash,
  getCrashRecord,
  handleCrashQueryParams,
  setAppCrash,
  type CrashRecord,
} from '@/lib/crash-state'
import { bandAPI } from '@/lib/band-api'
import { Button } from '@/components/ui/button'

function CrashScreen({ record }: { record: CrashRecord }) {
  return (
    <main className="min-h-screen bg-red-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <p className="text-red-300 text-sm font-mono uppercase tracking-widest mb-4">
          Error {record.errorCode}
        </p>
        <h1 className="text-5xl font-bold text-white mb-4">Application Down</h1>
        <p className="text-red-200 mb-6">{record.reason}</p>
        <p className="text-red-400 text-sm font-mono mb-8">
          Crashed at {new Date(record.timestamp).toLocaleString()}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => bandAPI.recover()}
            className="bg-white text-red-950 hover:bg-red-100"
          >
            Recover App
          </Button>
        </div>
        <p className="mt-8 text-xs text-red-400">
          Or call <code className="text-red-200">bandAPI.recover()</code> / visit{' '}
          <code className="text-red-200">/api/recover.html</code>
        </p>
      </div>
    </main>
  )
}

export function CrashGuard({ children }: { children: React.ReactNode }) {
  const [crashRecord, setCrashRecord] = useState<CrashRecord | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    window.bandAPI = bandAPI

    const queryAction = handleCrashQueryParams()
    if (queryAction === 'inject') {
      const record = setAppCrash('Fatal error injected via ?injectError=true')
      void fetch('/api/crash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: record.reason, errorCode: record.errorCode }),
        keepalive: true,
      }).catch(() => {})
      setCrashRecord(record)
      window.history.replaceState({}, '', window.location.pathname)
    } else if (queryAction === 'recover') {
      clearAppCrash()
      void fetch('/api/crash', { method: 'DELETE', keepalive: true }).catch(() => {})
      setCrashRecord(null)
      window.history.replaceState({}, '', window.location.pathname)
    } else {
      setCrashRecord(getCrashRecord())
    }

    setReady(true)
  }, [])

  if (!ready) return null
  if (crashRecord) return <CrashScreen record={crashRecord} />

  return <>{children}</>
}
