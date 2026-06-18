import { NextResponse, NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    const level = searchParams.get('level');

    const logs = logger.getLogs(limit, level || undefined);

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      count: logs.length,
      logs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
