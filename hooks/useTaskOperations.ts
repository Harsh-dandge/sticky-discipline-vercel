import { useMemo, useCallback } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { getRulesEngineResult, getTaskPoints } from '@/lib/rulesEngine';

export function useRulesEngine(date?: Date) {
  const rules = useMemo(() => getRulesEngineResult(date), [date]);
  return rules;
}

export function useTaskOperations() {
  const { addTask, updateTask, deleteTask, completeTask, tasks } = useTaskStore();
  const rules = useRulesEngine();

  const canAdd = rules.isAddAllowed;
  const canDelete = rules.isDeleteAllowed;
  const canEdit = rules.isEditable;
  const canComplete = rules.isCompleteAllowed;

  const handleAddTask = useCallback(async (text: string, type: 'pre-planned' | 'same-day' | 'carried') => {
    if (!canAdd) return null;
    const task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      type,
      status: 'pending' as const,
      createdAt: Date.now(),
      points: getTaskPoints(type),
    };
    await addTask(task);
    return task;
  }, [addTask, canAdd]);

  const handleEditTask = useCallback(async (taskId: string, newText: string) => {
    if (!canEdit) return;
    await updateTask(taskId, { text: newText });
  }, [updateTask, canEdit]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!canDelete) return;
    await deleteTask(taskId);
  }, [deleteTask, canDelete]);

  const handleCompleteTask = useCallback(async (taskId: string) => {
    if (!canComplete) return;
    await completeTask(taskId);
  }, [completeTask, canComplete]);

  return {
    tasks,
    canAdd,
    canDelete,
    canEdit,
    canComplete,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleCompleteTask,
    mode: rules.mode,
  };
}

export function useCarryForward() {
  const { tasks, addTask } = useTaskStore();

  const getIncompleteTasks = useCallback(() => {
    return tasks.filter(t => t.status === 'pending');
  }, [tasks]);

  const carryForwardTasks = useCallback(async (previousDate: string) => {
    const incomplete = getIncompleteTasks();
    const carriedTasks = incomplete.map(t => ({
      ...t,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'carried' as const,
      status: 'pending' as const,
      completedAt: undefined,
      createdAt: Date.now(),
      points: 1,
    }));
    for (const task of carriedTasks) {
      await addTask(task);
    }
    return carriedTasks;
  }, [getIncompleteTasks, addTask]);

  return {
    incompleteTasks: getIncompleteTasks(),
    carryForwardTasks,
  };
}

export function useTaskStats() {
  const tasks = useTaskStore(state => state.tasks);

  return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const points = tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.points, 0);
    const byType = {
      'pre-planned': tasks.filter(t => t.type === 'pre-planned').length,
      'same-day': tasks.filter(t => t.type === 'same-day').length,
      'carried': tasks.filter(t => t.type === 'carried').length,
    };
    const completedByType = {
      'pre-planned': tasks.filter(t => t.type === 'pre-planned' && t.status === 'completed').length,
      'same-day': tasks.filter(t => t.type === 'same-day' && t.status === 'completed').length,
      'carried': tasks.filter(t => t.type === 'carried' && t.status === 'completed').length,
    };
    return { total, completed, pending, points, byType, completedByType };
  }, [tasks]);
}
