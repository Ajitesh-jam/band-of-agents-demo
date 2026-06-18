'use client';

import { useEffect, useState } from 'react';
import { AnimatedAgent } from './animated-agent';
import { Agent, agentManager } from '@/lib/agents';

export function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    const agents = agentManager.getAgents();
    const health = agentManager.getSystemHealth();
    setAgents(agents);
    setSystemHealth(health);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleInjectError = async (agentId: string) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, action: 'inject' }),
      });
      refreshData();
    } catch (error) {
      console.error('Error injecting error:', error);
    }
  };

  const handleResolveError = async (agentId: string) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, action: 'resolve' }),
      });
      refreshData();
    } catch (error) {
      console.error('Error resolving error:', error);
    }
  };

  const handleInjectRandomError = async () => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'random' }),
      });
      refreshData();
    } catch (error) {
      console.error('Error injecting random error:', error);
    }
  };

  if (loading || !systemHealth) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>Loading agents...</p>
        </div>
      </div>
    );
  }

  const statusColor = systemHealth.status === 'healthy' ? 'text-green-400' : systemHealth.status === 'degraded' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 bg-opacity-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">Band of Agents</h1>
          <p className="text-gray-400">A demo app for BAND OF AGENTS hackathon</p>
        </div>
      </header>

      {/* System Health Card */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">System Status</h2>
            <div className={`text-2xl font-bold ${statusColor}`}>{systemHealth.status.toUpperCase()}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 rounded p-4">
              <div className="text-sm text-gray-400 mb-1">Healthy Agents</div>
              <div className="text-2xl font-bold text-green-400">{systemHealth.agents.healthy}/5</div>
            </div>
            <div className="bg-slate-900 rounded p-4">
              <div className="text-sm text-gray-400 mb-1">Avg Latency</div>
              <div className="text-2xl font-bold text-blue-400">{systemHealth.metrics.avgResponseTime.toFixed(0)}ms</div>
            </div>
            <div className="bg-slate-900 rounded p-4">
              <div className="text-sm text-gray-400 mb-1">Avg CPU</div>
              <div className="text-2xl font-bold text-orange-400">{systemHealth.metrics.avgCpu.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Auto Refresh (2s)</span>
            </label>
            <button
              onClick={refreshData}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-sm font-medium"
            >
              🔄 Refresh Now
            </button>
            <button
              onClick={handleInjectRandomError}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-sm font-medium ml-auto"
            >
              💥 Inject Random Error
            </button>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6"
            >
              <AnimatedAgent
                agent={agent}
                onInject={handleInjectError}
                onResolve={handleResolveError}
              />
            </div>
          ))}
        </div>

        {/* API Documentation */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-900 rounded p-4">
              <div className="font-mono text-blue-400 mb-2">GET /api/health</div>
              <p className="text-gray-400">Get system and agent health status</p>
            </div>
            <div className="bg-slate-900 rounded p-4">
              <div className="font-mono text-blue-400 mb-2">GET /api/logs</div>
              <p className="text-gray-400">Fetch logs with filtering options</p>
            </div>
            <div className="bg-slate-900 rounded p-4">
              <div className="font-mono text-blue-400 mb-2">POST /api/errors</div>
              <p className="text-gray-400">Inject or resolve errors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
