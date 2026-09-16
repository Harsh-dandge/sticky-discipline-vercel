'use client';

import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import StickyNote from '@/components/StickyNote';
import { formatDate } from '@/lib/rulesEngine';

const DashboardPage: React.FC = () => {
  const { user, tasks } = useTaskStore();

  if (!user) return null;

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    points: tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.points, 0),
  };

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#FFD700' },
    { name: 'Pre-planned', value: tasks.filter(t => t.type === 'pre-planned').length, color: '#3B82F6' },
    { name: 'Same-day', value: tasks.filter(t => t.type === 'same-day').length, color: '#22C55E' },
    { name: 'Carried', value: tasks.filter(t => t.type === 'carried').length, color: '#F97316' },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-handwritten text-sticky-yellow mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-handwritten mb-4">Today&rsquo;s Stats</h2>
          <div className="space-y-2 text-gray-300 font-handwritten2">
            <p>Total Tasks: <span className="text-white">{stats.total}</span></p>
            <p>Completed: <span className="text-green-400">{stats.completed}</span></p>
            <p>Pending: <span className="text-orange-400">{stats.pending}</span></p>
            <p>Points Earned: <span className="text-yellow-400">{stats.points}</span></p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-handwritten mb-4">Task Breakdown</h2>
          {pieData.length > 0 ? (
            <div className="flex items-center justify-center h-48">
              <svg viewBox="0 0 100 100" className="w-48 h-48">
                {pieData.map((entry, i) => {
                  const circumference = 2 * Math.PI * 40;
                  const offset = circumference - (entry.value / stats.total) * circumference;
                  const color = entry.color;
                  return (
                    <circle
                      key={i}
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke={color}
                      strokeWidth="20"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-500"
                    />
                  );
                })}
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold fill-white" fontSize="14">
                  {stats.completed}/{stats.total}
                </text>
              </svg>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500 font-handwritten2">
              No data yet
            </div>
          )}
          <div className="mt-4 space-y-1">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-400 font-handwritten2">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-handwritten mb-4">Current Tasks</h2>
        <StickyNote tasks={tasks} date={formatDate(new Date())} />
      </div>
    </div>
  );
};

export default DashboardPage;
