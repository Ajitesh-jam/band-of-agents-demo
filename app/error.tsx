'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    void fetch('/api/report-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'route-error',
        message: error.message,
        stack: error.stack,
      }),
      keepalive: true,
    })
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-900 mb-3">Application Error</h1>
      <p className="text-red-700 mb-6 max-w-lg">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  )
}
