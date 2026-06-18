'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AGENTS = ['Atlas', 'Echo', 'Nova', 'Flux', 'Iris'];

interface AnimatingAgent {
  id: number;
  name: string;
  x: number;
  y: number;
}

export function Dashboard() {
  const [agents, setAgents] = useState<AnimatingAgent[]>([]);

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

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

      {/* Animated floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Band of Agents
          </h1>
          <p className="text-xl text-slate-600">
            A demo app for BAND OF AGENTS hackathon
          </p>
        </motion.div>

        {/* Animated Agents Container */}
        <div className="relative w-full max-w-3xl h-96 mb-16">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              animate={{
                x: `${agent.x}%`,
                y: `${agent.y}%`,
              }}
              transition={{
                duration: 4,
                ease: 'easeInOut',
              }}
              className="absolute"
            >
              {/* Agent circle */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
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

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center max-w-2xl"
        >
          <p className="text-lg text-slate-600 leading-relaxed">
            Intelligent agents working in harmony. Experience a seamless collaboration 
            between autonomous agents solving complex problems efficiently and in real-time.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
