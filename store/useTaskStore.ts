import { create } from 'zustand';
import { Task, DailyNote, User } from '@/types/task';
import { formatDate } from '@/lib/rulesEngine';
import { onDailyNoteSnapshot, saveDailyNote } from '@/services/firestore';
import { onAuthStateChanged } from '@/services/auth';

function makeDailyNoteId(userId: string, date: string): string {
  return `${userId}_${date}`;
}

interface TaskStore {
  user: User | null;
  tasks: Task[];
  currentDate: string;
  isLoading: boolean;
  noteCreatedAt: number | null;
  setUser: (user: User | null) => void;
  setCurrentDate: (date: string) => void;
  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  initializeNote: (userId: string, date: string) => () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  user: null,
  tasks: [],
  currentDate: formatDate(new Date()),
  isLoading: false,
  noteCreatedAt: null,

  setUser: (user) => set({ user }),
  setCurrentDate: (date) => {
    set({ currentDate: date });
    const { user: currentUser } = get();
    if (currentUser) {
      get().initializeNote(currentUser.uid, date);
    }
  },

  addTask: async (task) => {
    const { currentDate, user, noteCreatedAt } = get();
    if (!user) return;
    const currentTasks = [...get().tasks, task];
    set({ tasks: currentTasks });
    await saveDailyNote({
      id: makeDailyNoteId(user.uid, currentDate),
      date: currentDate,
      userId: user.uid,
      tasks: currentTasks,
      createdAt: noteCreatedAt ?? Date.now(),
      updatedAt: Date.now(),
    });
  },

  updateTask: async (taskId, updates) => {
    const { currentDate, user, noteCreatedAt } = get();
    if (!user) return;
    const currentTasks = get().tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    set({ tasks: currentTasks });
    await saveDailyNote({
      id: makeDailyNoteId(user.uid, currentDate),
      date: currentDate,
      userId: user.uid,
      tasks: currentTasks,
      createdAt: noteCreatedAt ?? Date.now(),
      updatedAt: Date.now(),
    });
  },

  deleteTask: async (taskId) => {
    const { currentDate, user, noteCreatedAt } = get();
    if (!user) return;
    const currentTasks = get().tasks.filter(t => t.id !== taskId);
    set({ tasks: currentTasks });
    await saveDailyNote({
      id: makeDailyNoteId(user.uid, currentDate),
      date: currentDate,
      userId: user.uid,
      tasks: currentTasks,
      createdAt: noteCreatedAt ?? Date.now(),
      updatedAt: Date.now(),
    });
  },

  completeTask: async (taskId) => {
    const { currentDate, user, noteCreatedAt } = get();
    if (!user) return;
    const now = Date.now();
    const currentTasks = get().tasks.map(t => {
      if (t.id === taskId) {
        const isCurrentlyCompleted = t.status === 'completed';
        if (isCurrentlyCompleted) {
          // Un-completing: drop completedAt entirely — Firestore rejects `undefined` values.
          const { completedAt, ...rest } = t;
          return { ...rest, status: 'pending' as const };
        }
        return { ...t, status: 'completed' as const, completedAt: now };
      }
      return t;
    });
    set({ tasks: currentTasks });
    await saveDailyNote({
      id: makeDailyNoteId(user.uid, currentDate),
      date: currentDate,
      userId: user.uid,
      tasks: currentTasks,
      createdAt: noteCreatedAt ?? Date.now(),
      updatedAt: Date.now(),
    });
  },

  initializeNote: (userId, date) => {
    const unsubscribe = onDailyNoteSnapshot(userId, date, (note) => {
      if (note) {
        set({
          tasks: note.tasks || [],
          noteCreatedAt: typeof note.createdAt === 'number' ? note.createdAt : null,
        });
      } else {
        set({ tasks: [], noteCreatedAt: null });
      }
    });
    return unsubscribe;
  },
}));

export function useAuthState() {
  return onAuthStateChanged((user) => {
    useTaskStore.getState().setUser(user);
  });
}
