import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .openapi({ description: 'Title of the task' }),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .openapi({ description: 'Description of the task' }),
  status: z
    .enum(['todo', 'in-progress', 'done'])
    .optional()
    .openapi({ description: 'Status of the task' }),
  isStarred: z
    .boolean()
    .optional()
    .openapi({ description: 'Whether the task is starred' }),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .openapi({ description: 'Due date of the task' }),
  parentTaskId: z
    .string()
    .optional()
    .openapi({ description: 'ID of the parent task' }),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .optional()
    .openapi({ description: 'Title of the task' }),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .openapi({ description: 'Description of the task' }),
  status: z
    .enum(['todo', 'in-progress', 'done'])
    .optional()
    .openapi({ description: 'Status of the task' }),
  isStarred: z
    .boolean()
    .optional()
    .openapi({ description: 'Whether the task is starred' }),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .openapi({ description: 'Due date of the task' }),
  parentTaskId: z
    .string()
    .optional()
    .openapi({ description: 'ID of the parent task' }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
