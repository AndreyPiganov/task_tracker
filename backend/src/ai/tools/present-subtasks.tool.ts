import type OpenAI from 'openai';

export const presentSubtasksTool = {
  type: 'function',
  name: 'present_subtasks',
  description: 'Показывает пользователю три предложенные подзадачи.',
  strict: true,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      subtasks: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 3 },
    },
    required: ['subtasks'],
  },
} satisfies OpenAI.Responses.FunctionTool;

export function parseSubtasks(args: string): string[] {
  const payload: { subtasks?: unknown } | null = JSON.parse(args);
  const subtasks = payload?.subtasks;
  if (!Array.isArray(subtasks) || subtasks.length !== 3
    || !subtasks.every((item): item is string => typeof item === 'string' && item.trim() !== '')) {
    throw new Error('Invalid subtask tool arguments');
  }

  return subtasks.map((item) => item.trim());
}
