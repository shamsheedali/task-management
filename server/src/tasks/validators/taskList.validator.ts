import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const createTaskListSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .openapi({ description: 'Title of the task list' }),
});

export const editTaskListSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .openapi({ description: 'Title of the task list' }),
});

export type CreateTaskListInput = z.infer<typeof createTaskListSchema>;
