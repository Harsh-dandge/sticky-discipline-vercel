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

export function isFutureDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate > today;
}

export function isToday(dateStr: string): boolean {
  return formatDate(new Date()) === dateStr;
}

/**
 * Parse a 'YYYY-MM-DD' string as local midnight (avoids UTC timezone trap).
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Max number of months ahead a user can plan tasks. */
const MAX_FUTURE_MONTHS = 3;

export function getRulesEngineResult(dateStr: string): RulesEngineResult {
  // Parse target date as local midnight
  const targetDateOnly = parseLocalDate(dateStr);

  // Today at local midnight
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isPast = targetDateOnly < todayMidnight;
  const isToday = targetDateOnly.getTime() === todayMidnight.getTime();
  const isFuture = targetDateOnly > todayMidnight;

  // Compute the max-plannable date (today + 3 months)
  const maxPlanDate = new Date(now.getFullYear(), now.getMonth() + MAX_FUTURE_MONTHS, now.getDate());
  const isWithinPlanningWindow = isFuture && targetDateOnly <= maxPlanDate;

  if (isPast) {
    // PAST: view-only, no editing, no completing, no deleting
    return {
      mode: 'execution',
      isEditable: false,
      isAddAllowed: false,
      isDeleteAllowed: false,
      isCompleteAllowed: false,
    };
  }

  if (isToday) {
    // TODAY: planning mode before noon, execution mode after noon
    const mode = now.getHours() < NOON_THRESHOLD ? 'planning' : 'execution';
    return {
      mode,
      isEditable: mode === 'planning',
      isAddAllowed: mode === 'planning',
      isDeleteAllowed: mode === 'planning',
      isCompleteAllowed: true,
    };
  }

  if (isWithinPlanningWindow) {
    // FUTURE within 3 months: full planning access
    return {
      mode: 'planning',
      isEditable: true,
      isAddAllowed: true,
      isDeleteAllowed: true,
      isCompleteAllowed: false,
    };
  }

  // FUTURE beyond 3 months: view-only
  return {
    mode: 'execution',
    isEditable: false,
    isAddAllowed: false,
    isDeleteAllowed: false,
    isCompleteAllowed: false,
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

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

export function shouldSendReminder(): boolean {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  return hour === 20 && minute === 0;
}

export function shouldSendDailyReport(): boolean {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  return hour === 23 && minute === 0;
}

export function isMidnightReset(): boolean {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const second = new Date().getSeconds();
  return hour === 23 && minute === 59 && second >= 55;
}
