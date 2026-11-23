import { useId, useState, type FormEvent } from 'react';
import { errorMessage, tasksApi } from '../api/tasks';
import { taskStatuses, type Task, type TaskStatus } from '../types/task';
import { SubtaskSuggestions } from './SubtaskSuggestions';

export function TaskCard({ task, onChanged }: { task: Task; onChanged: () => void }) {
  const fieldId = useId();
  const [original, setOriginal] = useState<Task | null>(null);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  function startEditing() {
    setTitle(task.title);
    setStatus(task.status);
    setError('');
    setOriginal(task);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !original) return;
    const changes: Partial<Pick<Task, 'title' | 'status'>> = {};
    if (title.trim() !== original.title) changes.title = title.trim();
    if (status !== original.status) changes.status = status;
    if (Object.keys(changes).length === 0) {
      setError('');
      setOriginal(null);
      return;
    }
    setError('');
    setPending(true);

    try {
      await tasksApi.update(task.id, changes);
      setOriginal(null);
      onChanged();
    } catch (error) {
      setError(errorMessage(error, 'Не удалось сохранить задачу.'));
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (pending || !window.confirm(`Удалить задачу «${task.title}»?`)) return;
    setError('');
    setPending(true);

    try {
      await tasksApi.delete(task.id);
      onChanged();
    } catch (error) {
      setError(errorMessage(error, 'Не удалось удалить задачу.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <li className="task-card">
      {original ? (
        <form className="edit-form" onSubmit={save}>
          <div className="edit-fields">
            <label htmlFor={`${fieldId}-title`}>
              Название
              <input id={`${fieldId}-title`} value={title} onChange={(event) => setTitle(event.target.value)}
                maxLength={200} disabled={pending} required autoFocus />
            </label>
            <label htmlFor={`${fieldId}-status`}>
              Статус
              <select id={`${fieldId}-status`} value={status} disabled={pending}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}>
                {Object.entries(taskStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <div className="task-actions">
            <button type="submit" className="button button-primary" disabled={pending}>
              {pending ? 'Сохраняем…' : 'Сохранить'}
            </button>
            <button type="button" className="button button-secondary" disabled={pending} onClick={() => {
              setError('');
              setOriginal(null);
            }}>Отмена</button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-summary">
            <h3>{task.title}</h3>
            <span className={`badge badge-${task.status.toLowerCase()}`}>{taskStatuses[task.status]}</span>
          </div>
          <div className="task-actions">
            <button type="button" className="button button-secondary" disabled={pending} onClick={startEditing}>
              Редактировать
            </button>
            <button type="button" className="button button-danger" disabled={pending} onClick={remove}>
              {pending ? 'Удаляем…' : 'Удалить'}
            </button>
          </div>
        </>
      )}
      {error && <p className="error" role="alert">{error}</p>}
      <SubtaskSuggestions key={task.title} title={task.title} disabled={original !== null || pending} />
    </li>
  );
}
