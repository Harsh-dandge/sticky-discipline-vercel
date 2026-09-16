import { NextRequest, NextResponse } from 'next/server';
import { getDailyNote, saveDailyNote } from '@/services/firestore';
import { Task, DailyNote } from '@/types/task';
import { formatDate } from '@/lib/rulesEngine';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || formatDate(new Date());
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const note = await getDailyNote(userId, date);
  return NextResponse.json({ note });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, date, task }: { userId: string; date: string; task: Task } = await request.json();

    const existingNote = await getDailyNote(userId, date);
    const newTask = { ...task, id: uuidv4(), createdAt: Date.now(), points: task.points || 2 };

    if (existingNote) {
      const updatedTasks = [...existingNote.tasks, newTask];
      await saveDailyNote({ ...existingNote, tasks: updatedTasks });
      return NextResponse.json({ note: { ...existingNote, tasks: updatedTasks } });
    } else {
      const note: DailyNote = {
        id: uuidv4(),
        date,
        userId,
        tasks: [newTask],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveDailyNote(note);
      return NextResponse.json({ note });
    }
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: unknown }).message
          : undefined;

    return NextResponse.json(
      { error: typeof errorMessage === 'string' ? errorMessage : 'Unknown error' },
      { status: 500 }
    );
  }
}
