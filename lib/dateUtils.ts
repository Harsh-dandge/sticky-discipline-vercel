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

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday) === dateStr;
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

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
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
