import type { SubtaskResult, Task, TaskFilter } from '../types/task';

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`/api/${path}`, init);
  if (response.ok) return response;

  const body: { message?: unknown } | null = await response.json().catch(() => null);
  const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
  throw new Error(typeof message === 'string' ? message : 'Запрос не удалось выполнить.');
}

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await request(path, init);
  return response.json();
}

function write(method: 'POST' | 'PATCH', body: object): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const tasksApi = {
  list(filter: TaskFilter, signal: AbortSignal) {
    const query = filter === 'ALL' ? '' : `?status=${filter}`;
    return json<Task[]>(`tasks${query}`, { signal });
  },
  create(title: string) {
    return json<Task>('tasks', write('POST', { title }));
  },
  update(id: string, changes: Partial<Pick<Task, 'title' | 'status'>>) {
    return json<Task>(`tasks/${id}`, write('PATCH', changes));
  },
  async delete(id: string) {
    await request(`tasks/${id}`, { method: 'DELETE' });
  },
  generateSubtasks(title: string, signal: AbortSignal) {
    return json<SubtaskResult>('ai/subtasks', { ...write('POST', { title }), signal });
  },
};

export function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && !(error instanceof TypeError)) return error.message;
  return fallback;
}
