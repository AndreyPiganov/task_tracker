import { useEffect, useRef, useState } from 'react';
import { errorMessage, tasksApi } from '../api/tasks';
import type { SubtaskResult } from '../types/task';

export function SubtaskSuggestions({ title, disabled }: { title: string; disabled: boolean }) {
  const [result, setResult] = useState<SubtaskResult>();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function generate() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setError('');
    setPending(true);

    try {
      const next = await tasksApi.generateSubtasks(title, controller.signal);
      if (!controller.signal.aborted) setResult(next);
    } catch (error) {
      if (!controller.signal.aborted) setError(errorMessage(error, 'Не удалось сгенерировать подзадачи.'));
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  }

  return (
    <div className="subtasks">
      <button type="button" className="button button-ai" disabled={pending || disabled} onClick={generate}>
        <span aria-hidden="true">✦</span>
        {pending ? 'Генерируем…' : 'Сгенерировать подзадачи'}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
      {result && (
        <div className="subtasks-result" aria-live="polite">
          <h4>Предложенные подзадачи</h4>
          {result.source === 'stub' && <p className="source-label">Шаблонные предложения · демо-режим</p>}
          <ol>{result.subtasks.map((item, index) => <li key={index}>{item}</li>)}</ol>
        </div>
      )}
    </div>
  );
}
