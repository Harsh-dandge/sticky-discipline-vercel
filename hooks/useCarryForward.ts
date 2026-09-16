import { Task } from '@/types/task';
import { useTaskStore } from '@/store/useTaskStore';
import { useRulesEngine } from './useTaskOperations';

export function useCarryForward(dateStr: string) {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const rules = useRulesEngine(dateStr);

  const incompleteTasks = tasks.filter(t => t.status === 'pending');

  const carryForward = async () => {
    const carried: Task[] = incompleteTasks.map(t => ({
      ...t,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'carried' as const,
      status: 'pending' as const,
      completedAt: undefined,
      createdAt: Date.now(),
      points: 1,
    }));

    for (const task of carried) {
      await addTask(task);
    }
    return carried;
  };

  return {
    incompleteTasks,
    carryForward,
    canCarryForward: rules.isAddAllowed && incompleteTasks.length > 0,
  };
}
