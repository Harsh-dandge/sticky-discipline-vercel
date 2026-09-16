import { Task } from '@/types/task';
import { useTaskStore } from '@/store/useTaskStore';

export function useCarryForward() {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);

  const incompleteTasks = tasks.filter(t => t.status === 'pending');

  const carryForward = async (previousDate: string) => {
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

  return { incompleteTasks, carryForward };
}
