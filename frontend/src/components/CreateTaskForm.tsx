import { useState, type FormEvent } from 'react';
import { errorMessage, tasksApi } from '../api/tasks';

export function CreateTaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError('');
    setPending(true);

    try {
      await tasksApi.create(title.trim());
      setTitle('');
      onCreated();
    } catch (error) {
      setError(errorMessage(error, 'Не удалось создать задачу.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="panel create-panel" aria-labelledby="create-title">
      <h2 id="create-title">Новая задача</h2>
      <form className="create-form" onSubmit={submit}>
        <label htmlFor="new-task-title">Название</label>
        <input id="new-task-title" placeholder="Например, подготовить отчёт" value={title}
          onChange={(event) => setTitle(event.target.value)} maxLength={200} disabled={pending} required />
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? 'Создаём…' : 'Добавить задачу'}
        </button>
      </form>
    </section>
  );
}
