import { useEffect, useState } from 'react';
import { errorMessage, tasksApi } from './api/tasks';
import { CreateTaskForm } from './components/CreateTaskForm';
import { TaskCard } from './components/TaskCard';
import { type Task, type TaskFilter } from './types/task';

const filters = [
  ['ALL', 'Все'],
  ['NEW', 'Новые'],
  ['IN_PROGRESS', 'В работе'],
  ['DONE', 'Готовые'],
] as const;

type TaskListResult = { filter: TaskFilter; tasks: Task[]; error?: string };

export function App() {
  const [filter, setFilter] = useState<TaskFilter>('ALL');
  const [result, setResult] = useState<TaskListResult>();
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    tasksApi.list(filter, controller.signal).then(
      (tasks) => {
        if (!controller.signal.aborted) setResult({ filter, tasks });
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({ filter, tasks: [], error: errorMessage(error, 'Не удалось загрузить задачи.') });
        }
      },
    );
    return () => controller.abort();
  }, [filter, revision]);

  const refresh = () => setRevision((previous) => previous + 1);
  const current = result?.filter === filter ? result : undefined;

  function handleCreated() {
    setFilter((currentFilter) => currentFilter === 'ALL' || currentFilter === 'NEW' ? currentFilter : 'ALL');
    refresh();
  }

  return (
    <>
      <header className="site-header">
        <div className="shell brand">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <h1>Трекер задач</h1>
        </div>
      </header>
      <main className="shell workspace">
        <CreateTaskForm onCreated={handleCreated} />
        <section className="panel task-list" aria-labelledby="list-title" aria-busy={!current}>
          <div className="list-header">
            <div className="list-title">
              <h2 id="list-title">Задачи</h2>
              {current && !current.error && <span className="count" aria-label={`Задач в списке: ${current.tasks.length}`}>{current.tasks.length}</span>}
            </div>
            <div className="filters" role="group" aria-label="Фильтр по статусу">
              {filters.map(([value, label]) => (
                <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {!current ? (
            <p className="list-message" role="status">Загружаем задачи…</p>
          ) : current.error ? (
            <div className="list-message">
              <p role="alert" className="error">{current.error}</p>
              <button type="button" className="button button-secondary" onClick={refresh}>Повторить</button>
            </div>
          ) : current.tasks.length === 0 ? (
            <p className="list-message">{filter === 'ALL' ? 'Задач пока нет' : 'Нет задач с этим статусом'}</p>
          ) : (
            <ul className="task-items">
              {current.tasks.map((task) => <TaskCard key={task.id} task={task} onChanged={refresh} />)}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
