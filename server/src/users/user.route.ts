import { Router } from 'express';
import { asyncWrap } from '../utils/asyncWrapper';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, verifyOtpSchema } from './user.validator';
import container from '../config/inversify.config';
import UserController from './user.controller';
import TYPES from '../types/inversify.types';

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

export default router;
