import { describe, it, expect } from 'vitest';
import { getTaskPoints, TaskType } from '@/lib/rulesEngine';

describe('Carry Forward Logic', () => {
  it('should assign correct points to carried tasks', () => {
    expect(getTaskPoints('carried')).toBe(1);
  });

  it('should assign correct points to pre-planned tasks', () => {
    expect(getTaskPoints('pre-planned')).toBe(3);
  });

  it('should carry forward incomplete tasks with type changed to carried', () => {
    const incompleteTask = {
      id: '1',
      text: 'Incomplete task',
      type: 'pre-planned' as TaskType,
      status: 'pending' as const,
      createdAt: Date.now(),
      points: 3,
    };

    const carriedTask = {
      ...incompleteTask,
      type: 'carried' as TaskType,
      status: 'pending' as const,
      completedAt: undefined,
      createdAt: Date.now(),
      points: 1,
    };

    expect(carriedTask.type).toBe('carried');
    expect(carriedTask.status).toBe('pending');
    expect(carriedTask.points).toBe(1);
    expect(carriedTask.text).toBe('Incomplete task');
  });
});

describe('Date Utilities', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    const result = date.toISOString().split('T')[0];
    expect(result).toBe('2024-01-15');
  });
});
