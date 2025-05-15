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

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .openapi({ description: 'User email address' }),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .openapi({ description: 'User OTP' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
