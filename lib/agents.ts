import { logger } from './logger';

export interface AgentMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
  tasksCompleted: number;
  uptime: number;
}

export interface Agent {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'error';
  metrics: AgentMetrics;
  lastUpdated: Date;
}

const AGENT_NAMES = ['Atlas', 'Echo', 'Nova', 'Flux', 'Iris'];

class AgentManager {
  private agents: Map<string, Agent> = new Map();
  private startTime = Date.now();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    AGENT_NAMES.forEach((name, index) => {
      const id = `agent-${index + 1}`;
      this.agents.set(id, {
        id,
        name,
        status: 'healthy',
        metrics: {
          cpu: Math.random() * 30,
          memory: Math.random() * 40,
          responseTime: Math.random() * 100 + 50,
          tasksCompleted: Math.floor(Math.random() * 1000) + 100,
          uptime: Date.now() - this.startTime,
        },
        lastUpdated: new Date(),
      });
    });
    logger.info('Agents initialized', { count: this.agents.size });
  }

  getAgents(): Agent[] {
    const agents = Array.from(this.agents.values());
    
    // Update metrics
    agents.forEach(agent => {
      if (agent.status === 'error') {
        agent.metrics.cpu = Math.min(100, Math.random() * 80 + 50);
        agent.metrics.memory = Math.min(100, Math.random() * 70 + 40);
        agent.metrics.responseTime = Math.random() * 500 + 200;
      } else if (agent.status === 'degraded') {
        agent.metrics.cpu = Math.random() * 50 + 20;
        agent.metrics.memory = Math.random() * 50 + 20;
        agent.metrics.responseTime = Math.random() * 200 + 100;
      } else {
        agent.metrics.cpu = Math.random() * 30;
        agent.metrics.memory = Math.random() * 40;
        agent.metrics.responseTime = Math.random() * 100 + 50;
      }
      agent.metrics.tasksCompleted += Math.floor(Math.random() * 10);
      agent.metrics.uptime = Date.now() - this.startTime;
      agent.lastUpdated = new Date();
    });

    return agents;
  }

  getAgentById(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getSystemHealth() {
    const agents = Array.from(this.agents.values());
    const healthy = agents.filter(a => a.status === 'healthy').length;
    const degraded = agents.filter(a => a.status === 'degraded').length;
    const error = agents.filter(a => a.status === 'error').length;
    
    const avgCpu = agents.reduce((sum, a) => sum + a.metrics.cpu, 0) / agents.length;
    const avgMemory = agents.reduce((sum, a) => sum + a.metrics.memory, 0) / agents.length;
    const avgResponseTime = agents.reduce((sum, a) => sum + a.metrics.responseTime, 0) / agents.length;

    let systemStatus: 'healthy' | 'degraded' | 'error' = 'healthy';
    if (error > 0) systemStatus = 'error';
    else if (degraded > 0 || avgCpu > 80 || avgMemory > 80) systemStatus = 'degraded';

    return {
      status: systemStatus,
      agents: {
        healthy,
        degraded,
        error,
      },
      metrics: {
        avgCpu,
        avgMemory,
        avgResponseTime,
      },
    };
  }

  injectError(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'error';
      logger.warn(`Error injected into agent ${agent.name}`, { agentId });
    }
  }

  resolveError(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'healthy';
      agent.metrics.cpu = Math.random() * 30;
      agent.metrics.memory = Math.random() * 40;
      agent.metrics.responseTime = Math.random() * 100 + 50;
      logger.info(`Error resolved for agent ${agent.name}`, { agentId });
    }
  }

  injectRandomError() {
    const agents = Array.from(this.agents.values());
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    this.injectError(randomAgent.id);
    return randomAgent.id;
  }
}

export const agentManager = new AgentManager();
