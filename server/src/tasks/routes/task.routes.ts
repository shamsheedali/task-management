import { Router } from 'express';
import container from '../../config/inversify.config';
import TYPES from '../../types/inversify.types';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncWrap } from '../../utils/asyncWrapper';
import TaskController from '../controllers/task.controller';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTaskInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the task
 *           example: "Complete report"
 *         description:
 *           type: string
 *           description: Description of the task
 *           example: "Finish the quarterly report"
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done]
 *           description: Status of the task
 *           example: "todo"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority of the task
 *           example: "high"
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Due date of the task
 *           example: "2025-05-20"
 *         parentTaskId:
 *           type: string
 *           description: ID of the parent task (for sub-tasks)
 *           example: "6825e026b45def4c90932199"
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "6825e026b45def4c90932199"
 *         title:
 *           type: string
 *           example: "Complete report"
 *         description:
 *           type: string
 *           example: "Finish the quarterly report"
 *         status:
 *           type: string
 *           example: "todo"
 *         priority:
 *           type: string
 *           example: "high"
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2025-05-20"
 *         taskListId:
 *           type: string
 *           example: "6825e026b45def4c90932199"
 *         userId:
 *           type: string
 *           example: "6825e026b45def4c90932199"
 *         parentTaskId:
 *           type: string
 *           example: "6825e026b45def4c90932199"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const router = Router();
const taskController = container.get<TaskController>(TYPES.TaskController);

/**
 * @swagger
 * /api/tasklists/{taskListId}/tasks:
 *   post:
 *     summary: Create a new task in a task list
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskListId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Task created successfully' }
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized or invalid token
 *       400:
 *         description: Invalid input or duplicate title
 *       404:
 *         description: Task list not found
 */
router.post(
  '/:taskListId/tasks',
  authMiddleware,
  validate(createTaskSchema),
  asyncWrap(taskController.createTask.bind(taskController))
);

/**
 * @swagger
 * /api/tasklists/{taskListId}/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskListId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task list
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
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Task updated successfully' }
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or duplicate title
 *       404:
 *         description: Task or task list not found
 */
router.patch(
  '/:taskListId/tasks/:taskId',
  authMiddleware,
  validate(updateTaskSchema),
  asyncWrap(taskController.updateTask.bind(taskController))
);

/**
 * @swagger
 * /api/tasklists/{taskListId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskListId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task list
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Task deleted successfully' }
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Task has sub-tasks
 *       404:
 *         description: Task or task list not found
 */
router.delete(
  '/:taskListId/tasks/:taskId',
  authMiddleware,
  asyncWrap(taskController.deleteTask.bind(taskController))
);

/**
 * @swagger
 * /api/tasklists/{taskListId}/tasks:
 *   get:
 *     summary: Get all tasks in a task list
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskListId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task list
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Tasks retrieved successfully' }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task list not found
 */
router.get(
  '/:taskListId/tasks',
  authMiddleware,
  asyncWrap(taskController.getTasksByTaskListId.bind(taskController))
);

/**
 * @swagger
 * /api/tasks/summary:
 *   get:
 *     summary: Get summary of tasks (done vs todo) for a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskSummaryResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/summary',
  authMiddleware,
  asyncWrap(taskController.getTaskSummary.bind(taskController))
);

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task completion stats over time for a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to retrieve stats for
 *     responses:
 *       200:
 *         description: Task stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStatsResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/stats',
  authMiddleware,
  asyncWrap(taskController.getTaskStats.bind(taskController))
);
export default router;
