import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { registerSchema, loginSchema } from '../users/user.validator';
import { generateSchema } from '@anatine/zod-openapi';
import { z } from 'zod';

const userResponseSchema = z.object({
  id: z.string().openapi({ description: 'User ID' }),
  username: z.string().openapi({ description: 'Username of the user' }),
  email: z.string().email().openapi({ description: 'User email address' }),
  createdAt: z.date().openapi({ description: 'User creation date' }),
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API for managing tasks and users',
    },
    components: {
      schemas: {
        RegisterInput: generateSchema(registerSchema),
        LoginInput: generateSchema(loginSchema),
        UserResponse: generateSchema(userResponseSchema),
      },
    },
  },
  apis: ['./src/users/routes/*.ts', './src/tasks/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = swaggerUi.setup(specs);
export const swaggerServe = swaggerUi.serve;
