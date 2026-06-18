'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
        source: 'global-error',
        message: error.message,
        stack: error.stack,
      }),
      keepalive: true,
    })
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-red-950 text-white">
        <h1 className="text-3xl font-bold mb-3">Application Down</h1>
        <p className="text-red-200 mb-6 max-w-lg">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-white px-4 py-2 text-red-950 font-medium"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
