'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bandAPI } from '@/lib/band-api';
import { Button } from '@/components/ui/button';

const AGENTS = ['Atlas', 'Echo', 'Nova', 'Flux', 'Iris'];

interface AnimatingAgent {
  id: number;
  name: string;
  x: number;
  y: number;
}

type PanelView = 'health' | 'logs' | 'deployment' | null;

export function Dashboard() {
  const [agents, setAgents] = useState<AnimatingAgent[]>([]);
  const [panel, setPanel] = useState<PanelView>(null);
  const [panelTitle, setPanelTitle] = useState('');
  const [panelData, setPanelData] = useState<object | null>(null);

  useEffect(() => {
    setAgents(
      AGENTS.map((name, i) => ({
        id: i,
        name,
        x: Math.random() * 90,
        y: Math.random() * 70,
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          x: Math.random() * 90,
          y: Math.random() * 70,
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  function showPanel(title: string, data: unknown) {
    setPanelTitle(title);
    setPanelData(data);
  }

  function closePanel() {
    setPanel(null);
    setPanelData(null);
  }

  function handleHealth() {
    setPanel('health');
    showPanel('System Health', bandAPI.getHealth());
  }

  function handleLogs() {
    setPanel('logs');
    showPanel('Activity Logs', bandAPI.getLogs(50));
  }

  function handleDeploymentLogs() {
    setPanel('deployment');
    showPanel('Deployment Logs', bandAPI.getDeploymentLogs());
  }

  function handleInjectFatalError() {
    if (window.confirm('This will crash the entire app until recovered. Continue?')) {
      bandAPI.injectFatalError('Fatal error injected via dashboard button');
    }
  }

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Band of Agents
          </h1>
          <p className="text-xl text-slate-600">
            A demo app for BAND OF AGENTS hackathon
          </p>
        </motion.div>

        <div className="relative w-full max-w-3xl h-96 mb-12">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              animate={{ x: `${agent.x}%`, y: `${agent.y}%` }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="absolute"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white font-semibold text-sm cursor-pointer transition-all hover:shadow-xl
                  ${
                    index === 0
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : index === 1
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                        : index === 2
                          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600'
                          : index === 3
                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                            : 'bg-gradient-to-r from-pink-500 to-pink-600'
                  }
                `}
              >
                {agent.name[0]}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center max-w-2xl mb-10"
        >
          <p className="text-lg text-slate-600 leading-relaxed">
            Intelligent agents working in harmony. Experience a seamless collaboration
            between autonomous agents solving complex problems efficiently and in real-time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Button onClick={handleHealth} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            Check Health
          </Button>
          <Button onClick={handleLogs} variant="secondary" className="px-6">
            View Logs
          </Button>
          <Button onClick={handleDeploymentLogs} variant="outline" className="px-6">
            Deployment Logs
          </Button>
          <Button
            onClick={handleInjectFatalError}
            variant="destructive"
            className="px-6"
          >
            Crash App
          </Button>
        </motion.div>

        <p className="mt-4 text-sm text-slate-400">
          Or open the browser console and try{' '}
          <code className="text-slate-500">bandAPI.getHealth()</code>
          {' · '}
          <code className="text-slate-500">bandAPI.injectFatalError()</code>
        </p>
      </div>

      <AnimatePresence>
        {panel && panelData && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4"
          >
            <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur shadow-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">{panelTitle}</h3>
                <Button variant="ghost" size="sm" onClick={closePanel}>
                  Close
                </Button>
              </div>
              <pre className="text-xs text-slate-600 overflow-auto max-h-64 bg-slate-50 rounded-lg p-4">
                {JSON.stringify(panelData, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
