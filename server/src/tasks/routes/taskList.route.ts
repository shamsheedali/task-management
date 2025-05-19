import { Router } from 'express';
import container from '../../config/inversify.config';
import TYPES from '../../types/inversify.types';
import { authMiddleware } from '../../middleware/auth.middleware';
import {
  createTaskListSchema,
  editTaskListSchema,
} from '../validators/taskList.validator';
import TaskListController from '../controllers/taskList.controller';
import { validate } from '../../middleware/validate.middleware';
import { asyncWrap } from '../../utils/asyncWrapper';

const router = Router();
const taskListController = container.get<TaskListController>(
  TYPES.TaskListController
);

router.get(
  '/',
  authMiddleware,
  asyncWrap(taskListController.getTaskList.bind(taskListController))
);

/**
 * @swagger
 * /api/tasklists:
 *   post:
 *     summary: Create a new task list
 *     tags: [TaskLists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskListInput'
 *     responses:
 *       201:
 *         description: Task list created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Task list created successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: '6825e026b45def4c90932199' }
 *                     title: { type: string, example: 'Work' }
 *                     userId: { type: string, example: '6825e026b45def4c90932199' }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       400:
 *         description: Invalid title
 */
router.post(
  '/',
  authMiddleware,
  validate(createTaskListSchema),
  asyncWrap(taskListController.createTaskList.bind(taskListController))
);

router.patch(
  '/:id',
  authMiddleware,
  validate(editTaskListSchema),
  asyncWrap(taskListController.editTaskList.bind(taskListController))
);

router.delete(
  '/:id',
  authMiddleware,
  asyncWrap(taskListController.deleteTaskList.bind(taskListController))
);
export default router;
