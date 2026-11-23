export const taskStatuses = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  DONE: 'Готова',
} as const;

export type TaskStatus = keyof typeof taskStatuses;
export type TaskFilter = 'ALL' | TaskStatus;

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubtaskResult {
  subtasks: string[];
  source: 'openai' | 'stub';
}
