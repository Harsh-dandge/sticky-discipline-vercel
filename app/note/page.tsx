'use client';

import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import StickyNote from '@/components/StickyNote';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { useCarryForward } from '@/hooks/useCarryForward';

const NotePage: React.FC = () => {
  const { user, currentDate, setCurrentDate, tasks, initializeNote, addTask, completeTask, deleteTask } = useTaskStore();
  const { canAdd, mode } = useTaskOperations(currentDate);
  const { carryForward, canCarryForward } = useCarryForward(currentDate);
  const [newTaskText, setNewTaskText] = React.useState('');
  const [newTaskType, setNewTaskType] = React.useState<'pre-planned' | 'same-day' | 'carried'>('same-day');
  const [showAddForm, setShowAddForm] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const unsub = initializeNote(user.uid, currentDate);
    return () => unsub();
  }, [user, currentDate, initializeNote]);

  const handleAdd = async () => {
    if (!newTaskText.trim() || !canAdd) return;
    const task = {
      id: `${Date.now()}`,
      text: newTaskText.trim(),
      type: newTaskType,
      status: 'pending' as const,
      createdAt: Date.now(),
      points: newTaskType === 'pre-planned' ? 3 : newTaskType === 'same-day' ? 2 : 1,
    };
    await addTask(task);
    setNewTaskText('');
    setShowAddForm(false);
  };

  const handleCarryForward = async () => {
    await carryForward();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-handwritten">Please sign in to continue</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-handwritten text-sticky-yellow">📌 Today&rsquo;s Tasks</h1>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600"
            />
            <span className={`px-3 py-1 rounded-full text-sm font-handwritten ${
              mode === 'planning' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
            }`}>
              {mode}
            </span>
          </div>
        </div>

        {canAdd && (
          <div className="mb-4">
            {showAddForm ? (
              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="What needs to be done?"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-400 outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-3">
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as 'pre-planned' | 'same-day' | 'carried')}
                    className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                  >
                    <option value="pre-planned">Pre-planned</option>
                    <option value="same-day">Same-day</option>
                    <option value="carried">Carried</option>
                  </select>
                  <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 font-handwritten">Add</button>
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-handwritten">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-sticky-yellow text-gray-900 rounded-lg font-handwritten hover:bg-sticky-yellow-light transition-colors">
                + Add Task
              </button>
            )}
          </div>
        )}

        {!canAdd && (
          <div className="mb-4 p-3 bg-orange-900/50 border border-orange-600 rounded-lg">
            <p className="text-orange-200 font-handwritten text-sm">
              ⏱️ Execution Mode Active — Only completing tasks is allowed.
            </p>
          </div>
        )}

        <div className="flex justify-center mb-4">
          <StickyNote tasks={tasks} date={currentDate} onCompleteTask={completeTask} onDeleteTask={deleteTask} />
        </div>

        {canCarryForward && (
          <div className="text-center">
            <button
              onClick={handleCarryForward}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-handwritten hover:bg-orange-400 transition-colors"
            >
              🔄 Carry Forward Incomplete Tasks
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <div className="flex gap-4 justify-center text-sm font-handwritten2">
            <span className="text-blue-400">Pre-planned: {tasks.filter(t => t.type === 'pre-planned').length}</span>
            <span className="text-green-400">Same-day: {tasks.filter(t => t.type === 'same-day').length}</span>
            <span className="text-orange-400">Carried: {tasks.filter(t => t.type === 'carried').length}</span>
            <span className="text-green-300">Completed: {tasks.filter(t => t.status === 'completed').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePage;
