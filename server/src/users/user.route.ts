import { Router } from 'express';
import { asyncWrap } from '../utils/asyncWrapper';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, verifyOtpSchema } from './user.validator';
import container from '../config/inversify.config';
import UserController from './user.controller';
import TYPES from '../types/inversify.types';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const userController = container.get<UserController>(TYPES.UserController);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Initiate user registration and send OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'OTP sent to email. Please verify to complete registration.' }
 *       400:
 *         description: Validation error or user already exists
 */
router.post(
  '/register',
  validate(registerSchema),
  asyncWrap(userController.register.bind(userController))
);

/**
 * @swagger
 * /api/users/verify-and-register:
 *   post:
 *     summary: Verify OTP and complete user registration
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               otp:
 *                 type: string
 *                 example: '123456'
 *             required: [email, otp]
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
 *       400:
 *         description: Invalid or expired OTP, or no pending user data
 */
router.post(
  '/verify-and-register',
  validate(verifyOtpSchema),
  asyncWrap(userController.verifyAndRegister.bind(userController))
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

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'User profile retrieved successfully' }
 *                 data: { $ref: '#/components/schemas/UserResponse' }
 *       401:
 *         description: Unauthorized or invalid token
 */
router.get(
  '/me',
  authMiddleware,
  asyncWrap(userController.getProfile.bind(userController))
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Users retrieved successfully' }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized or invalid token
 */
router.get(
  '/',
  authMiddleware,
  asyncWrap(userController.getUsers.bind(userController))
);

/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Token refreshed successfully' }
 *                 accessToken: { type: string, example: 'jwt.token.here' }
 *       401:
 *         description: Unauthorized or invalid refresh token
 */
router.post(
  '/refresh',
  asyncWrap(userController.refreshToken.bind(userController))
);

export default router;
