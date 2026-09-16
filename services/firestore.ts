import { doc, setDoc, getDoc, collection, query, where, onSnapshot, updateDoc, serverTimestamp, getDocs } from 'firebase/firestore';
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
