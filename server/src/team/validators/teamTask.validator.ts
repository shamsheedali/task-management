import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const createTeamTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .openapi({ description: 'Title of the team task' }),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .openapi({ description: 'Description of the team task' }),
  status: z
    .enum(['todo', 'done'])
    .optional()
    .openapi({ description: 'Status of the team task' }),
  isStarred: z
    .boolean()
    .optional()
    .openapi({ description: 'Whether the team task is starred' }),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .openapi({ description: 'Due date of the team task' }),
  assigneeId: z
    .string()
    .optional()
    .openapi({ description: 'ID of the user assigned to the team task' }),
});

export const updateTeamTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .optional()
    .openapi({ description: 'Title of the team task' }),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .openapi({ description: 'Description of the team task' }),
  status: z
    .enum(['todo', 'done'])
    .optional()
    .openapi({ description: 'Status of the team task' }),
  isStarred: z
    .boolean()
    .optional()
    .openapi({ description: 'Whether the team task is starred' }),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .openapi({ description: 'Due date of the team task' }),
  assigneeId: z
    .string()
    .optional()
    .openapi({ description: 'ID of the user assigned to the team task' }),
});

export type CreateTeamTaskInput = z.infer<typeof createTeamTaskSchema>;
export type UpdateTeamTaskInput = z.infer<typeof updateTeamTaskSchema>;
