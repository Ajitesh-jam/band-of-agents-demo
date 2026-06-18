import { NextResponse } from 'next/server'
import { reportServerError } from '@/lib/server-health'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

type ReportErrorBody = {
  source?: string
  message?: string
  stack?: string
  file?: string
}

export async function POST(request: Request) {
  let body: ReportErrorBody = {}
  try {
    body = (await request.json()) as ReportErrorBody
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const message = body.message?.trim()
  if (!message) {
    return NextResponse.json({ ok: false, error: 'message is required' }, { status: 400 })
  }

  reportServerError(body.source ?? 'client', message, {
    stack: body.stack,
    file: body.file,
  })

  return NextResponse.json({ ok: true, reported: true })
}
