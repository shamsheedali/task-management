import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .max(100, 'Team name must be 100 characters or less')
    .openapi({ description: 'Name of the team' }),
});

export const inviteTeamSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .openapi({ description: 'Email address to invite to the team' }),
});

export const joinTeamSchema = z.object({
  code: z
    .string()
    .min(1, 'Invite code is required')
    .openapi({ description: 'Invite code to join the team' }),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type InviteTeamInput = z.infer<typeof inviteTeamSchema>;
export type JoinTeamInput = z.infer<typeof joinTeamSchema>;
