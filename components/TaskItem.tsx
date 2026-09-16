import React, { memo } from 'react';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
  canComplete?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = memo(({ task, onComplete, onDelete, showDelete = false, canComplete = true }) => {
  const isCompleted = task.status === 'completed';

  const typeStyles = {
    'pre-planned': 'bg-blue-600 text-white',
    'same-day': 'bg-emerald-600 text-white',
    'carried': 'bg-amber-600 text-white',
  };

  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-lg mb-2 transition-all duration-300 ${
        isCompleted ? 'opacity-60 bg-black/5' : 'bg-black/10 hover:bg-black/15 shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={() => onComplete(task.id)}
        disabled={!canComplete}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          isCompleted
            ? 'bg-emerald-600 border-emerald-700 text-white'
            : 'border-gray-700 bg-white/70 hover:bg-white hover:border-gray-900'
        } ${canComplete ? '' : 'opacity-40 cursor-not-allowed'}`}
        title={isCompleted ? 'Mark pending' : (canComplete ? 'Mark completed' : 'Completed tasks are view-only')}
      >
        {isCompleted && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-base font-handwritten transition-all duration-300 ${
          isCompleted ? 'line-through text-gray-500' : 'text-gray-900 font-semibold'
        }`}
      >
        {task.text}
      </span>

      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeStyles[task.type]}`}>
        {task.type}
      </span>

      {showDelete && (
        <button
          type="button"
          onClick={() => onDelete?.(task.id)}
          className="text-red-700 hover:text-red-900 transition-colors text-xl font-bold px-1 leading-none"
          title="Delete task"
        >
          &times;
        </button>
      )}
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
