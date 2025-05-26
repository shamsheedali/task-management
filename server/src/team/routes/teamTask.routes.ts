import { Router } from 'express';
import container from '../../config/inversify.config';
import TYPES from '../../types/inversify.types';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncWrap } from '../../utils/asyncWrapper';
import TeamTaskController from '../controllers/teamTask.controller';
import {
  createTeamTaskSchema,
  updateTeamTaskSchema,
} from '../validators/teamTask.validator';

const router = Router();
const teamTaskController = container.get<TeamTaskController>(
  TYPES.TeamTaskController
);

/**
 * @swagger
 * /api/teams/{teamId}/tasks:
 *   post:
 *     summary: Create a new task in a team
 *     tags: [TeamTasks]
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
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Design Homepage"
 *               description:
 *                 type: string
 *                 example: "Create wireframes for new homepage"
 *               status:
 *                 type: string
 *                 enum: [todo, done]
 *                 example: "todo"
 *               isStarred:
 *                 type: boolean
 *                 example: false
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-25"
 *               assigneeId:
 *                 type: string
 *                 example: "6825e026b45def4c90932199"
 *     responses:
 *       201:
 *         description: Team task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Team task created successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: '6825e026b45def4c90932199' }
 *                     title: { type: string, example: 'Design Homepage' }
 *                     description: { type: string, example: 'Create wireframes for new homepage' }
 *                     status: { type: string, example: 'todo' }
 *                     isStarred: { type: boolean, example: false }
 *                     dueDate: { type: string, format: date, example: '2025-05-25' }
 *                     teamId: { type: string, example: '6825e026b45def4c90932199' }
 *                     assigneeId: { type: string, example: '6825e026b45def4c90932199' }
 *                     creatorId: { type: string, example: '6825e026b45def4c90932199' }
 *                     userId: { type: string, example: '6825e026b45def4c90932199' }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is not a member of the team
 *       404:
 *         description: Team not found
 *       400:
 *         description: Invalid input or duplicate title
 */
router.post(
  '/:teamId/tasks',
  authMiddleware,
  validate(createTeamTaskSchema),
  asyncWrap(teamTaskController.createTeamTask.bind(teamTaskController))
);

/**
 * @swagger
 * /api/teams/{teamId}/tasks:
 *   get:
 *     summary: Get all tasks in a team
 *     tags: [TeamTasks]
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
 *         description: Team tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Team tasks retrieved successfully' }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: '6825e026b45def4c90932199' }
 *                       title: { type: string, example: 'Design Homepage' }
 *                       description: { type: string, example: 'Create wireframes for new homepage' }
 *                       status: { type: string, example: 'todo' }
 *                       isStarred: { type: boolean, example: false }
 *                       dueDate: { type: string, format: date, example: '2025-05-25' }
 *                       teamId: { type: string, example: '6825e026b45def4c90932199' }
 *                       assigneeId: { type: string, example: '6825e026b45def4c90932199' }
 *                       creatorId: { type: string, example: '6825e026b45def4c90932199' }
 *                       userId: { type: string, example: '6825e026b45def4c90932199' }
 *                       createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is not a member of the team
 *       404:
 *         description: Team not found
 */
router.get(
  '/:teamId/tasks',
  authMiddleware,
  asyncWrap(teamTaskController.getTeamTasks.bind(teamTaskController))
);

/**
 * @swagger
 * /api/teams/{teamId}/tasks/{taskId}:
 *   patch:
 *     summary: Update a team task
 *     tags: [TeamTasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Design Homepage"
 *               description:
 *                 type: string
 *                 example: "Create wireframes for new homepage"
 *               status:
 *                 type: string
 *                 enum: [todo, done]
 *                 example: "todo"
 *               isStarred:
 *                 type: boolean
 *                 example: false
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-25"
 *               assigneeId:
 *                 type: string
 *                 example: "6825e026b45def4c90932199"
 *     responses:
 *       200:
 *         description: Team task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Team task updated successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: '6825e026b45def4c90932199' }
 *                     title: { type: string, example: 'Design Homepage' }
 *                     description: { type: string, example: 'Create wireframes for new homepage' }
 *                     status: { type: string, example: 'todo' }
 *                     isStarred: { type: boolean, example: false }
 *                     dueDate: { type: string, format: date, example: '2025-05-25' }
 *                     teamId: { type: string, example: '6825e026b45def4c90932199' }
 *                     assigneeId: { type: string, example: '6825e026b45def4c90932199' }
 *                     creatorId: { type: string, example: '6825e026b45def4c90932199' }
 *                     userId: { type: string, example: '6825e026b45def4c90932199' }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is not a member of the team
 *       404:
 *         description: Team or task not found
 *       400:
 *         description: Invalid input or duplicate title
 */
router.patch(
  '/:teamId/tasks/:taskId',
  authMiddleware,
  validate(updateTeamTaskSchema),
  asyncWrap(teamTaskController.updateTeamTask.bind(teamTaskController))
);

/**
 * @swagger
 * /api/teams/{teamId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a team task
 *     tags: [TeamTasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Team task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Team task deleted successfully' }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is not a member of the team
 *       404:
 *         description: Team or task not found
 */
router.delete(
  '/:teamId/tasks/:taskId',
  authMiddleware,
  asyncWrap(teamTaskController.deleteTeamTask.bind(teamTaskController))
);

export default router;
