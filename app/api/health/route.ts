import { NextResponse } from 'next/server'
import {
  buildHealthPayload,
  isServerHealthy,
} from '@/lib/server-health'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const payload = buildHealthPayload()
  const healthy = isServerHealthy()

  return NextResponse.json(payload, {
    status: healthy ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  })
}
