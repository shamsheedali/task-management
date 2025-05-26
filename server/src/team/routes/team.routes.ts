import { Router } from 'express';
import container from '../../config/inversify.config';
import TYPES from '../../types/inversify.types';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncWrap } from '../../utils/asyncWrapper';
import TeamController from '../controllers/team.controller';
import {
  createTeamSchema,
  inviteTeamSchema,
  joinTeamSchema,
} from '../validators/team.validator';

const router = Router();
const teamController = container.get<TeamController>(TYPES.TeamController);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Project Alpha"
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Team created successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: '6825e026b45def4c90932199' }
 *                     name: { type: string, example: 'Project Alpha' }
 *                     creatorId: { type: string, example: '6825e026b45def4c90932199' }
 *                     members: { type: array, items: { type: string }, example: ['6825e026b45def4c90932199'] }
 *                     inviteCodes: { type: array, items: { type: object }, example: [] }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       400:
 *         description: Invalid team name or duplicate team name
 */
router.post(
  '/',
  authMiddleware,
  validate(createTeamSchema),
  asyncWrap(teamController.createTeam.bind(teamController))
);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams for the authenticated user
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Teams retrieved successfully' }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: '6825e026b45def4c90932199' }
 *                       name: { type: string, example: 'Project Alpha' }
 *                       creatorId: { type: string, example: '6825e026b45def4c90932199' }
 *                       members: { type: array, items: { type: string }, example: ['6825e026b45def4c90932199'] }
 *                       inviteCodes: { type: array, items: { type: object }, example: [] }
 *                       createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 */
router.get(
  '/',
  authMiddleware,
  asyncWrap(teamController.getUserTeams.bind(teamController))
);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   get:
 *     summary: Get team details by ID
 *     tags: [Teams]
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
 *         description: Team retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Team retrieved successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: '6825e026b45def4c90932199' }
 *                     name: { type: string, example: 'Project Alpha' }
 *                     creatorId: { type: string, example: '6825e026b45def4c90932199' }
 *                     members: { type: array, items: { type: string }, example: ['6825e026b45def4c90932199'] }
 *                     inviteCodes: { type: array, items: { type: object }, example: [] }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is not a member of the team
 *       404:
 *         description: Team not found
 */
router.get(
  '/:teamId',
  authMiddleware,
  asyncWrap(teamController.getTeam.bind(teamController))
);

/**
 * @swagger
 * /api/teams/{teamId}/invite:
 *   post:
 *     summary: Generate an invite for a team
 *     tags: [Teams]
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       201:
 *         description: Invite created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Invite created successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     code: { type: string, example: 'inv-1234567890' }
 *                     email: { type: string, example: 'john.doe@example.com' }
 *                     expiresAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is not the team creator
 *       404:
 *         description: Team not found
 *       400:
 *         description: Invalid email
 */
router.post(
  '/:teamId/invite',
  authMiddleware,
  validate(inviteTeamSchema),
  asyncWrap(teamController.createInvite.bind(teamController))
);

/**
 * @swagger
 * /api/teams/{teamId}/join:
 *   post:
 *     summary: Join a team using an invite code
 *     tags: [Teams]
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
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "inv-1234567890"
 *     responses:
 *       200:
 *         description: Joined team successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Joined team successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: '6825e026b45def4c90932199' }
 *                     name: { type: string, example: 'Project Alpha' }
 *                     creatorId: { type: string, example: '6825e026b45def4c90932199' }
 *                     members: { type: array, items: { type: string }, example: ['6825e026b45def4c90932199'] }
 *                     inviteCodes: { type: array, items: { type: object }, example: [] }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       400:
 *         description: Invalid or expired invite code
 *       404:
 *         description: Team not found
 */
router.post(
  '/:teamId/join',
  authMiddleware,
  validate(joinTeamSchema),
  asyncWrap(teamController.joinTeam.bind(teamController))
);

/**
 * @swagger
 * /api/teams/join-by-code:
 *   post:
 *     summary: Join a team using an invite code without specifying team ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "inv-1234567890"
 *     responses:
 *       200:
 *         description: Joined team successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Joined team successfully' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: '6825e026b45def4c90932199' }
 *                     name: { type: string, example: 'Project Alpha' }
 *                     creatorId: { type: string, example: '6825e026b45def4c90932199' }
 *                     members: { type: array, items: { type: string }, example: ['6825e026b45def4c90932199'] }
 *                     inviteCodes: { type: array, items: { type: object }, example: [] }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized or invalid token
 *       400:
 *         description: Invalid or expired invite code
 */
router.post(
  '/join-by-code',
  authMiddleware,
  validate(joinTeamSchema),
  asyncWrap(teamController.joinTeamByCode.bind(teamController))
);

/**
 * @swagger
 * /api/teams/{teamId}/members/{userId}:
 *   delete:
 *     summary: Leave a team
 *     tags: [Teams]
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user leaving the team
 *     responses:
 *       200:
 *         description: Left team successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'success' }
 *                 message: { type: string, example: 'Left team successfully' }
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: User is the team creator or not a member
 *       404:
 *         description: Team not found
 */
router.delete(
  '/:teamId/members/:userId',
  authMiddleware,
  asyncWrap(teamController.leaveTeam.bind(teamController))
);

export default router;
