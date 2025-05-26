import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const createNotificationSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(200, 'Message must be 200 characters or less')
    .openapi({ description: 'Notification message for the team' }),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
