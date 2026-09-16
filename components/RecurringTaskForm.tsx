'use client';

import React, { useState } from 'react';
import { createRecurringTask } from '@/services/firestore';

interface RecurringTaskFormProps {
  userId: string;
  onSubmitSuccess: () => void;
}

const RecurringTaskForm: React.FC<RecurringTaskFormProps> = ({ userId, onSubmitSuccess }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<'pre-planned' | 'same-day' | 'carried'>('pre-planned');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Compute date bounds for the inputs
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const maxDateObj = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
  const maxDateStr = `${maxDateObj.getFullYear()}-${String(maxDateObj.getMonth() + 1).padStart(2, '0')}-${String(maxDateObj.getDate()).padStart(2, '0')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }
    // Parse as local dates for comparison
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);
    const startLocal = new Date(sy, sm - 1, sd);
    const endLocal = new Date(ey, em - 1, ed);
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxLocal = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

    if (startLocal < todayLocal) {
      setError('Start date cannot be in the past');
      return;
    }
    if (endLocal > maxLocal) {
      setError('End date cannot be more than 3 months ahead');
      return;
    }
    if (endLocal < startLocal) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await createRecurringTask(userId, text.trim(), type, startDate, endDate);
      setText('');
      setStartDate('');
      setEndDate('');
      onSubmitSuccess();
    } catch (err) {
      setError((err as Error).message || 'Failed to create recurring task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-yellow-500/30 mb-4">
      <h3 className="text-lg font-handwritten text-yellow-400 mb-3">🔄 Recurring Task</h3>
      <p className="text-xs text-gray-400 font-handwritten2 mb-3">
        Add one task across multiple days at once
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task description (e.g., Daily Meditation)"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"
        />
        <div className="flex gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'pre-planned' | 'same-day' | 'carried')}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 flex-1"
          >
            <option value="pre-planned">Pre-planned (3pts)</option>
            <option value="same-day">Same-day (2pts)</option>
            <option value="carried">Carried (1pt)</option>
          </select>
          <input
            type="date"
            value={startDate}
            min={todayStr}
            max={maxDateStr}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 flex-1"
          />
          <input
            type="date"
            value={endDate}
            min={startDate || todayStr}
            max={maxDateStr}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 flex-1"
          />
        </div>
        {error && <p className="text-red-400 text-sm font-handwritten2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-handwritten hover:bg-yellow-400 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Adding...' : `Add Task to All Days`}
        </button>
      </form>
    </div>
  );
};

export default RecurringTaskForm;
