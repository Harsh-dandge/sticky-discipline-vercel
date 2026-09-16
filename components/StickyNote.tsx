'use client';

import React from 'react';
import { Task } from '@/types/task';
import TaskItem from './TaskItem';
import { useRulesEngine } from '@/hooks/useTaskOperations';

interface StickyNoteProps {
  tasks: Task[];
  date: string;
  onCompleteTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

const StickyNoteComponent: React.FC<StickyNoteProps> = ({ tasks, date, onCompleteTask, onDeleteTask }) => {
  const rules = useRulesEngine(date);

  return (
    <div className="sticky-note p-6 max-w-md w-full min-h-[400px] relative">
      <div className="mb-4">
        <h2 className="text-xl font-handwritten text-black mb-1">{date}</h2>
        <p className="text-xs text-gray-600 font-handwritten2">
          {tasks.filter(t => t.status === 'completed').length}/{tasks.length} tasks | {rules.mode}
        </p>
      </div>
      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={onCompleteTask || (() => {})}
            onDelete={onDeleteTask}
            showDelete={rules.isDeleteAllowed}
          />
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="flex items-center justify-center h-40 text-gray-400 font-handwritten2 text-lg">
          No tasks yet
        </div>
      )}
    </div>
  );
};

export default StickyNoteComponent;
