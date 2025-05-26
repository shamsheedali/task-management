import { Router } from 'express';
import container from '../../config/inversify.config';
import TYPES from '../../types/inversify.types';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncWrap } from '../../utils/asyncWrapper';
import NotificationController from '../controllers/notification.controller';
import { createNotificationSchema } from '../validators/notification.validator';

const router = Router();
const notificationController = container.get<NotificationController>(
  TYPES.NotificationController
);

/**
 * @swagger
 * /api/teams/{teamId}/notifications:
 *   get:
 *     summary: Get all notifications for a team
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Notifications retrieved successfully' }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: '6825e026b45def4c90932199' }
 *                       message: { type: string, example: 'User created task: Design Homepage' }
 *                       teamId: { type: string, example: '6825e026b45def4c90932199' }
 *                       timestamp: { type: string, format: date-time }
 *                       createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is not a member of the team
 *       404:
 *         description: Team not found
 */
router.get(
  '/:teamId/notifications',
  authMiddleware,
  asyncWrap(
    notificationController.getNotifications.bind(notificationController)
  )
);

/**
 * @swagger
 * /api/teams/{teamId}/notifications:
 *   post:
 *     summary: Create a notification for a team
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "User left the team"
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Notification created successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: '6825e026b45def4c90932199' }
 *                     message: { type: string, example: 'User left the team' }
 *                     teamId: { type: string, example: '6825e026b45def4c90932199' }
 *                     timestamp: { type: string, format: date-time }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is not a member of the team
 *       404:
 *         description: Team not found
 *       400:
 *         description: Invalid message
 */
router.post(
  '/:teamId/notifications',
  authMiddleware,
  validate(createNotificationSchema),
  asyncWrap(
    notificationController.createNotification.bind(notificationController)
  )
);

export default router;
