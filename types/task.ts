export type TaskType = 'pre-planned' | 'same-day' | 'carried';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  text: string;
  type: TaskType;
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
  points: number;
}

export interface DailyNote {
  id: string;
  date: string;
  userId: string;
  tasks: Task[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export type TimeMode = 'planning' | 'execution';

export interface RulesEngineResult {
  mode: TimeMode;
  isEditable: boolean;
  isAddAllowed: boolean;
  isDeleteAllowed: boolean;
  isCompleteAllowed: boolean;
}
