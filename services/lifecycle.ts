import { onDailyNoteSnapshot, getDailyNote, saveDailyNote } from '@/services/firestore';
import { formatDate } from '@/lib/rulesEngine';
import { useTaskStore } from '@/store/useTaskStore';

export class LifecycleScheduler {
  private intervals: NodeJS.Timeout[] = [];
  private userId: string | null = null;

  constructor(private onReminder?: () => void, private onReport?: () => void, private onReset?: () => void) {}

  start(userId: string) {
    this.userId = userId;
    this.scheduleReminder();
    this.scheduleReport();
    this.scheduleReset();
  }

  stop() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }

  private scheduleReminder() {
    const checkReminder = () => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 0) {
        this.onReminder?.();
      }
    };
    const interval = setInterval(checkReminder, 60000);
    this.intervals.push(interval);
    checkReminder();
  }

  private scheduleReport() {
    const checkReport = () => {
      const now = new Date();
      if (now.getHours() === 23 && now.getMinutes() === 0) {
        this.onReport?.();
      }
    };
    const interval = setInterval(checkReport, 60000);
    this.intervals.push(interval);
    checkReport();
  }

  private scheduleReset() {
    const checkReset = () => {
      const now = new Date();
      if (now.getHours() === 23 && now.getMinutes() === 59) {
        this.onReset?.();
      }
    };
    const interval = setInterval(checkReset, 30000);
    this.intervals.push(interval);
    checkReset();
  }

  getTodayTasks() {
    return getDailyNote(this.userId || '', formatDate(new Date()));
  }
}

export const lifecycleScheduler = new LifecycleScheduler();
