import { NextResponse, NextRequest } from 'next/server';
import { agentManager } from '@/lib/agents';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId = '', action = 'inject' } = body;

    // Handle random action first
    if (action === 'random') {
      const affectedAgentId = agentManager.injectRandomError();
      const affectedAgent = agentManager.getAgentById(affectedAgentId);
      return NextResponse.json({
        success: true,
        message: `Error injected into random agent ${affectedAgent?.name}`,
        agent: {
          id: affectedAgent?.id,
          name: affectedAgent?.name,
          status: 'error',
        },
      });
    }

    // Other actions require agentId
    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required for this action' },
        { status: 400 }
      );
    }

    const agent = agentManager.getAgentById(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    if (action === 'inject') {
      agentManager.injectError(agentId);
      return NextResponse.json({
        success: true,
        message: `Error injected into agent ${agent.name}`,
        agent: { id: agent.id, name: agent.name, status: 'error' },
      });
    } else if (action === 'resolve') {
      agentManager.resolveError(agentId);
      return NextResponse.json({
        success: true,
        message: `Error resolved for agent ${agent.name}`,
        agent: { id: agent.id, name: agent.name, status: 'healthy' },
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    logger.error('Error injection failed', { error: String(error) });
    return NextResponse.json(
      { error: 'Error injection failed' },
      { status: 500 }
    );
  }
}
