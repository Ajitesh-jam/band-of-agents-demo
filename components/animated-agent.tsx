'use client';

import { Agent } from '@/lib/agents';

interface AnimatedAgentProps {
  agent: Agent;
  onInject: (agentId: string) => void;
  onResolve: (agentId: string) => void;
}

export function AnimatedAgent({ agent, onInject, onResolve }: AnimatedAgentProps) {
  const statusColor = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const statusRing = {
    healthy: 'ring-green-500',
    degraded: 'ring-yellow-500',
    error: 'ring-red-500',
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        {/* Pulsing rings */}
        <div
          className={`absolute inset-0 rounded-full border-2 ${statusRing[agent.status]} opacity-30 animate-pulse`}
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <div
          className={`absolute inset-0 rounded-full border-2 ${statusRing[agent.status]} opacity-20`}
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s',
          }}
        />
        <div
          className={`absolute inset-0 rounded-full border-2 ${statusRing[agent.status]} opacity-10`}
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.6s',
          }}
        />

        {/* Center circle */}
        <div className={`absolute inset-4 rounded-full ${statusColor[agent.status]} shadow-lg flex items-center justify-center`}>
          <div className="text-white text-2xl font-bold">{agent.name.charAt(0)}</div>
        </div>
      </div>

      {/* Agent info */}
      <div className="text-center">
        <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
        <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-opacity-20"
          style={{
            backgroundColor: agent.status === 'healthy' ? 'rgb(34, 197, 94)' : agent.status === 'degraded' ? 'rgb(234, 179, 8)' : 'rgb(239, 68, 68)',
            color: agent.status === 'healthy' ? 'rgb(34, 197, 94)' : agent.status === 'degraded' ? 'rgb(234, 179, 8)' : 'rgb(239, 68, 68)',
          }}
        >
          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
        </div>
      </div>

      {/* Metrics */}
      <div className="text-xs text-gray-400 text-center space-y-1">
        <div>CPU: {agent.metrics.cpu.toFixed(1)}%</div>
        <div>Mem: {agent.metrics.memory.toFixed(1)}%</div>
        <div>Response: {agent.metrics.responseTime.toFixed(0)}ms</div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {agent.status === 'healthy' ? (
          <button
            onClick={() => onInject(agent.id)}
            className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Inject Error
          </button>
        ) : (
          <button
            onClick={() => onResolve(agent.id)}
            className="px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}
