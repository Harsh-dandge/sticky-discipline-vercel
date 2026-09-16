import { RulesEngineResult, TaskType } from '@/types/task';

const NOON_THRESHOLD = 12;

export function getCurrentMode(date: Date = new Date()): 'planning' | 'execution' {
  return date.getHours() < NOON_THRESHOLD ? 'planning' : 'execution';
}

export function isEditable(date: Date = new Date()): boolean {
  return getCurrentMode(date) === 'planning';
}

export function isAddAllowed(date: Date = new Date()): boolean {
  return getCurrentMode(date) === 'planning';
}

export function isDeleteAllowed(date: Date = new Date()): boolean {
  return getCurrentMode(date) === 'planning';
}

export function isCompleteAllowed(): boolean {
  return true;
}

export function getRulesEngineResult(date: Date = new Date()): RulesEngineResult {
  const mode = getCurrentMode(date);
  return {
    mode,
    isEditable: mode === 'planning',
    isAddAllowed: mode === 'planning',
    isDeleteAllowed: mode === 'planning',
    isCompleteAllowed: true,
  };
}

export function getTaskPoints(type: TaskType): number {
  switch (type) {
    case 'pre-planned': return 3;
    case 'same-day': return 2;
    case 'carried': return 1;
    default: return 1;
  }
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDateFromString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isToday(dateStr: string): boolean {
  return formatDate(new Date()) === dateStr;
}

export function isFutureDate(dateStr: string): boolean {
  return new Date(dateStr) > new Date(new Date().toDateString());
}

export function getDaysArray(days: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
}

export function generateTaskId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
