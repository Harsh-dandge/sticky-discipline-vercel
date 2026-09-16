import { doc, setDoc, getDoc, collection, query, where, onSnapshot, updateDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { getFirestoreInstance } from '@/firebase/config';
import { Task, DailyNote, User } from '@/types/task';
import { formatDate } from '@/lib/rulesEngine';

const db = getFirestoreInstance();

export async function createUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);

  // Firestore does not allow `undefined` values, so omit photoURL when absent.
  const profile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    createdAt: serverTimestamp(),
    ...(typeof user.photoURL === 'string' && user.photoURL.length > 0
      ? { photoURL: user.photoURL }
      : {}),
  };

  await setDoc(userRef, profile, { merge: true });
}

export async function getDailyNote(userId: string, date: string): Promise<DailyNote | null> {
  const noteRef = doc(db, 'dailyNotes', `${userId}_${date}`);
  const snap = await getDoc(noteRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as unknown as DailyNote;
}

export async function saveDailyNote(note: DailyNote): Promise<void> {
  const noteRef = doc(db, 'dailyNotes', `${note.userId}_${note.date}`);
  await setDoc(noteRef, {
    ...note,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function addTaskToDay(userId: string, date: string, task: Task): Promise<void> {
  const noteRef = doc(db, 'dailyNotes', `${userId}_${date}`);
  await updateDoc(noteRef, {
    tasks: [...(await getDailyNote(userId, date))?.tasks || [], task],
    updatedAt: serverTimestamp(),
  });
}

export function onDailyNoteSnapshot(userId: string, date: string, callback: (note: DailyNote | null) => void): () => void {
  const noteRef = doc(db, 'dailyNotes', `${userId}_${date}`);
  return onSnapshot(noteRef, (snap) => {
    if (!snap.exists()) {
      callback(null);
    } else {
      callback({ id: snap.id, ...snap.data() } as unknown as DailyNote);
    }
  });
}

export function onUserTasksSnapshot(userId: string, date: string, callback: (tasks: Task[]) => void): () => void {
  const noteRef = doc(db, 'dailyNotes', `${userId}_${date}`);
  return onSnapshot(noteRef, (snap) => {
    if (!snap.exists()) {
      callback([]);
    } else {
      const data = snap.data() as DailyNote;
      callback(data.tasks || []);
    }
  });
}

export async function updateTaskInDay(userId: string, date: string, taskId: string, updates: Partial<Task>): Promise<void> {
  const note = await getDailyNote(userId, date);
  if (!note) return;
  const updatedTasks = note.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
  await saveDailyNote({ ...note, tasks: updatedTasks });
}

export async function deleteTaskFromDay(userId: string, date: string, taskId: string): Promise<void> {
  const note = await getDailyNote(userId, date);
  if (!note) return;
  const updatedTasks = note.tasks.filter(t => t.id !== taskId);
  await saveDailyNote({ ...note, tasks: updatedTasks });
}

export async function completeTaskInDay(userId: string, date: string, taskId: string): Promise<void> {
  await updateTaskInDay(userId, date, taskId, {
    status: 'completed',
    completedAt: Date.now(),
  });
}

export async function createDailyNote(note: DailyNote): Promise<void> {
  const noteRef = doc(db, 'dailyNotes', `${note.userId}_${note.date}`);
  await setDoc(noteRef, {
    ...note,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getAllUserTasks(userId: string, startDate: string, endDate: string): Promise<DailyNote[]> {
  const notesRef = collection(db, 'dailyNotes');
  const q = query(notesRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const notes: DailyNote[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const noteDate = data.date;
    if (noteDate >= startDate && noteDate <= endDate) {
      notes.push({ id: doc.id, ...data } as unknown as DailyNote);
    }
  });
  return notes.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Move pending tasks from fromDate to toDate as carried tasks.
 * Idempotent: checks carryForwardProcessed marker to prevent duplicates.
 */
export async function carryForwardIncompleteTasks(
  userId: string,
  fromDate: string,
  toDate: string
): Promise<number> {
  const fromNote = await getDailyNote(userId, fromDate);
  if (!fromNote) return 0;

  // Idempotency: skip if already processed for this target date
  const marker = (fromNote as unknown as Record<string, unknown>)[`carryForwardProcessedFor`];
  if (marker === toDate) return 0;

  const pendingTasks = fromNote.tasks.filter(t => t.status === 'pending');
  if (pendingTasks.length === 0) {
    // Mark as processed even with 0 tasks so we don't re-check
    const fromRef = doc(db, 'dailyNotes', `${userId}_${fromDate}`);
    await updateDoc(fromRef, { [`carryForwardProcessedFor`]: toDate, updatedAt: serverTimestamp() });
    return 0;
  }

  // Create carried versions of pending tasks
  const carriedTasks: Task[] = pendingTasks.map(t => ({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: t.text,
    type: 'carried' as const,
    status: 'pending' as const,
    createdAt: Date.now(),
    points: 1,
  }));

  // Get or create the toDate note
  const toNote = await getDailyNote(userId, toDate);
  const batch = writeBatch(db);
  const toRef = doc(db, 'dailyNotes', `${userId}_${toDate}`);

  if (toNote) {
    batch.update(toRef, {
      tasks: [...toNote.tasks, ...carriedTasks],
      updatedAt: serverTimestamp(),
    });
  } else {
    batch.set(toRef, {
      userId,
      date: toDate,
      tasks: carriedTasks,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // Remove pending tasks from fromDate (mark completed tasks remain)
  const remainingTasks = fromNote.tasks.filter(t => t.status === 'completed');
  const fromRef = doc(db, 'dailyNotes', `${userId}_${fromDate}`);
  batch.update(fromRef, {
    tasks: remainingTasks,
    [`carryForwardProcessedFor`]: toDate,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  return carriedTasks.length;
}

export async function createRecurringTask(
  userId: string,
  taskText: string,
  taskType: 'pre-planned' | 'same-day' | 'carried',
  startDate: string,
  endDate: string
): Promise<void> {
  // Date validation: start must be today or future, end within 3 months
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const maxDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Parse as local midnight for comparison
  const [startY, startM, startD] = startDate.split('-').map(Number);
  const startLocal = new Date(startY, startM - 1, startD);
  const [endY, endM, endD] = endDate.split('-').map(Number);
  const endLocal = new Date(endY, endM - 1, endD);

  if (startLocal < todayMidnight) {
    throw new Error('Start date cannot be in the past');
  }
  if (endLocal > maxDate) {
    throw new Error('End date cannot be more than 3 months in the future');
  }
  if (endLocal < startLocal) {
    throw new Error('End date must be after start date');
  }

  const points = taskType === 'pre-planned' ? 3 : taskType === 'same-day' ? 2 : 1;

  const batch = writeBatch(db);
  const current = new Date(start);

  while (current <= end) {
    const dateStr = formatDate(current);
    const noteRef = doc(db, 'dailyNotes', `${userId}_${dateStr}`);
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${dateStr}`,
      text: taskText,
      type: taskType,
      status: 'pending',
      createdAt: Date.now(),
      points,
    };

    const existingNote = await getDoc(noteRef);
    if (existingNote.exists()) {
      const data = existingNote.data() as DailyNote;
      batch.update(noteRef, {
        tasks: [...(data.tasks || []), newTask],
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.set(noteRef, {
        userId,
        date: dateStr,
        tasks: [newTask],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  await batch.commit();
}

export async function getTaskStats(userId: string, days: number): Promise<{ total: number; completed: number; points: number }> {
  const today = new Date();
  const startDate = formatDate(new Date(today.getTime() - days * 86400000));
  const endDate = formatDate(today);
  const notes = await getAllUserTasks(userId, startDate, endDate);
  let total = 0;
  let completed = 0;
  let points = 0;
  notes.forEach(note => {
    note.tasks.forEach(task => {
      total++;
      if (task.status === 'completed') {
        completed++;
        points += task.points;
      }
    });
  });
  return { total, completed, points };
}

export async function getTasksByDateRange(userId: string, dates: string[]): Promise<Map<string, Task[]>> {
  const notesRef = collection(db, 'dailyNotes');
  const q = query(notesRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const result = new Map<string, Task[]>();
  snapshot.forEach(doc => {
    const data = doc.data() as DailyNote;
    if (dates.includes(data.date)) {
      result.set(data.date, data.tasks || []);
    }
  });
  return result;
}
