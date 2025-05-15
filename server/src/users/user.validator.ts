import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, 'Username is required')
    .openapi({ description: 'Username of the user' }),
  email: z
    .string()
    .email('Invalid email format')
    .openapi({ description: 'User email address' }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .openapi({ description: 'User password' }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .openapi({ description: 'User email address' }),
  password: z
    .string()
    .min(1, 'Password is required')
    .openapi({ description: 'User password' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
