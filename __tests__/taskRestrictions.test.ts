import { describe, it, expect, beforeEach } from 'vitest';
import { getCurrentMode, isEditable, isAddAllowed, isDeleteAllowed, isCompleteAllowed, getRulesEngineResult, getTaskPoints } from '@/lib/rulesEngine';
import { TaskType } from '@/types/task';

describe('Rules Engine', () => {
  it('returns planning mode before 12 PM', () => {
    const date = new Date();
    date.setHours(10, 0, 0, 0);
    expect(getCurrentMode(date)).toBe('planning');
  });

  it('returns execution mode after 12 PM', () => {
    const date = new Date();
    date.setHours(13, 0, 0, 0);
    expect(getCurrentMode(date)).toBe('execution');
  });

  it('returns planning mode at 11:59 AM', () => {
    const date = new Date();
    date.setHours(11, 59, 0, 0);
    expect(getCurrentMode(date)).toBe('planning');
  });

  it('isEditable returns true in planning mode', () => {
    const date = new Date();
    date.setHours(10, 0, 0, 0);
    expect(isEditable(date)).toBe(true);
  });

  it('isEditable returns false in execution mode', () => {
    const date = new Date();
    date.setHours(13, 0, 0, 0);
    expect(isEditable(date)).toBe(false);
  });

  it('isAddAllowed returns true before noon', () => {
    const date = new Date();
    date.setHours(10, 0, 0, 0);
    expect(isAddAllowed(date)).toBe(true);
  });

  it('isAddAllowed returns false after noon', () => {
    const date = new Date();
    date.setHours(13, 0, 0, 0);
    expect(isAddAllowed(date)).toBe(false);
  });

  it('isDeleteAllowed returns true before noon', () => {
    const date = new Date();
    date.setHours(10, 0, 0, 0);
    expect(isDeleteAllowed(date)).toBe(true);
  });

  it('isDeleteAllowed returns false after noon', () => {
    const date = new Date();
    date.setHours(13, 0, 0, 0);
    expect(isDeleteAllowed(date)).toBe(false);
  });

  it('isCompleteAllowed always returns true', () => {
    expect(isCompleteAllowed()).toBe(true);
  });

  it('getTaskPoints returns correct values', () => {
    expect(getTaskPoints('pre-planned')).toBe(3);
    expect(getTaskPoints('same-day')).toBe(2);
    expect(getTaskPoints('carried')).toBe(1);
  });
});

describe('Task Restrictions', () => {
  it('enforces planning mode before noon for add/delete/edit', () => {
    const noon = new Date();
    noon.setHours(11, 59, 0, 0);
    const rules = getRulesEngineResult(noon);
    expect(rules.isAddAllowed).toBe(true);
    expect(rules.isDeleteAllowed).toBe(true);
    expect(rules.isEditable).toBe(true);
  });

  it('enforces execution mode after noon - no add/delete', () => {
    const afternoon = new Date();
    afternoon.setHours(13, 0, 0, 0);
    const rules = getRulesEngineResult(afternoon);
    expect(rules.isAddAllowed).toBe(false);
    expect(rules.isDeleteAllowed).toBe(false);
    expect(rules.isEditable).toBe(false);
    expect(rules.isCompleteAllowed).toBe(true);
  });
});
