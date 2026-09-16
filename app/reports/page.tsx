'use client';

import React from 'react';
import StickyNote from '@/components/StickyNote';
import { useTaskStore } from '@/store/useTaskStore';
import { formatDate } from '@/lib/rulesEngine';

import { useTaskOperations } from '@/hooks/useTaskOperations';
import { getRulesEngineResult } from '@/lib/rulesEngine';

const ReportPage: React.FC = () => {
  const { tasks } = useTaskStore();
  const { mode } = useTaskOperations();
  const rules = getRulesEngineResult();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    points: tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.points, 0),
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0,
  };

  const pieData = [
    { name: 'Pre-planned', value: tasks.filter(t => t.type === 'pre-planned').length, color: '#3B82F6' },
    { name: 'Same-day', value: tasks.filter(t => t.type === 'same-day').length, color: '#22C55E' },
    { name: 'Carried', value: tasks.filter(t => t.type === 'carried').length, color: '#F97316' },
    { name: 'Completed', value: stats.completed, color: '#FFD700' },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-handwritten text-sticky-yellow mb-6">📊 Reports Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 font-handwritten2 text-sm">Total</p>
            <p className="text-2xl font-handwritten text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 font-handwritten2 text-sm">Completed</p>
            <p className="text-2xl font-handwritten text-green-400">{stats.completed}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 font-handwritten2 text-sm">Pending</p>
            <p className="text-2xl font-handwritten text-orange-400">{stats.pending}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 font-handwritten2 text-sm">Points</p>
            <p className="text-2xl font-handwritten text-yellow-400">{stats.points}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-handwritten mb-4">Completion Rate</h2>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="8"
                    strokeDasharray={`${(stats.completionRate / 100) * 251.2} ${251.2}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000"
                  />
                  <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontFamily="Patrick Hand">
                    {stats.completionRate}%
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-handwritten mb-4">Task Distribution</h2>
            <div className="space-y-2">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-gray-300 font-handwritten2">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-handwritten mb-4">Current Tasks — {formatDate(new Date())}</h2>
          <StickyNote tasks={tasks} date={formatDate(new Date())} />
        </div>

        <div className="mt-4 text-center">
          <span className={`px-3 py-1 rounded-full text-sm font-handwritten ${
            rules.mode === 'planning' ? 'bg-blue-500' : 'bg-orange-500'
          } text-white`}>
            {rules.mode} Mode
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
