import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from './user.validator';
import container from '../config/inversify.config';
import UserController from './user.controller';
import TYPES from '../types/inversify.types';
import { asyncWrap } from '../utils/asyncWrapper';

const router = Router();
const userController = container.get<UserController>(TYPES.UserController);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'User created successfully' }
 *                 data: { $ref: '#/components/schemas/UserResponse' }
 *                 accessToken: { type: string, example: 'jwt.token.here' }
 */
router.post(
  '/register',
  validate(registerSchema),
  asyncWrap(userController.register.bind(userController))
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Login successful' }
 *                 data: { $ref: '#/components/schemas/UserResponse' }
 *                 accessToken: { type: string, example: 'jwt.token.here' }
 */
router.post(
  '/login',
  validate(loginSchema),
  asyncWrap(userController.login.bind(userController))
);

export default router;
