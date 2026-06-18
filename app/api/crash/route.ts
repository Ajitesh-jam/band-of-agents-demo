import { NextResponse } from 'next/server'
import { clearServerCrash, clearServerErrors, setServerCrash } from '@/lib/server-health'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

type CrashBody = {
  reason?: string
  errorCode?: string
}

export async function POST(request: Request) {
  let body: CrashBody = {}
  try {
    body = (await request.json()) as CrashBody
  } catch {
    body = {}
  }

  const crash = setServerCrash(
    body.reason ?? 'Fatal application crash',
    body.errorCode ?? 'FATAL_APP_CRASH'
  )

  return NextResponse.json({ ok: true, crash }, { status: 503 })
}

export async function DELETE() {
  clearServerCrash()
  clearServerErrors()
  return NextResponse.json({ ok: true, recovered: true })
}
