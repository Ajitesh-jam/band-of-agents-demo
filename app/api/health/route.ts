import { NextResponse } from 'next/server';
import { agentManager } from '@/lib/agents';

export async function GET() {
  try {
    const agents = agentManager.getAgents();
    const health = agentManager.getSystemHealth();

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      systemHealth: health,
      agents: agents.map(a => ({
        id: a.id,
        name: a.name,
        status: a.status,
        metrics: a.metrics,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get health status' },
      { status: 500 }
    );
  }
}
