import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { AppError } from '../../utils/appError';
import UserService from '../../users/user.service';
import MailService from '../../common/services/mail.service';
import {
  CreateTeamInput,
  InviteTeamInput,
  JoinTeamInput,
} from '../validators/team.validator';
import TYPES from '../../types/inversify.types';
import TeamService from '../services/team.service';
import NotificationService from '../services/notification.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import { TeamDTO, toTeamDTO } from '../dto/team.dto';

@injectable()
export default class TeamController {
  private _teamService: TeamService;
  private _userService: UserService;
  private _mailService: MailService;
  private _notificationService: NotificationService;

  constructor(
    @inject(TYPES.TeamService) teamService: TeamService,
    @inject(TYPES.UserService) userService: UserService,
    @inject(TYPES.MailService) mailService: MailService,
    @inject(TYPES.NotificationService) notificationService: NotificationService
  ) {
    this._teamService = teamService;
    this._userService = userService;
    this._mailService = mailService;
    this._notificationService = notificationService;
  }

  /**
   * Creates a new team for the authenticated user.
   * @param req - Request with team name and authenticated user ID.
   * @param res - Response with created team data.
   */
  async createTeam(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const { name }: CreateTeamInput = req.body;
    const team = await this._teamService.createTeam(name, userId);
    await this._userService.addTeamToUser(userId, team._id.toString());

    const teamDTO: TeamDTO = toTeamDTO(team);
    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'Team created successfully',
      data: teamDTO,
    });
  }

  /**
   * Retrieves all teams for the authenticated user.
   * @param req - Request with authenticated user ID.
   * @param res - Response with user's teams.
   */
  async getUserTeams(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const teams = await this._teamService.getUserTeams(userId);
    const teamDTOs: TeamDTO[] = teams.map(team =>
      toTeamDTO(team, req.user?.email)
    );
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Teams retrieved successfully',
      data: teamDTOs,
    });
  }

  /**
   * Retrieves a team by ID, ensuring the user is a member.
   * @param req - Request with team ID and authenticated user ID.
   * @param res - Response with team data.
   */
  async getTeam(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const teamId = req.params.teamId;
    const team = await this._teamService.getTeam(teamId, userId);
    const teamDTO: TeamDTO = toTeamDTO(team, req.user?.email);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Team retrieved successfully',
      data: teamDTO,
    });
  }

  /**
   * Generates an invite for a team and sends it via email.
   * @param req - Request with team ID, email to invite, and authenticated user ID.
   * @param res - Response with invite data.
   */
  async createInvite(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const teamId = req.params.teamId;
    const { email }: InviteTeamInput = req.body;
    const invite = await this._teamService.createInvite(teamId, userId, email);

    await this._mailService.sendInviteEmail(email, invite.code, teamId);
    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'Invite created successfully',
      data: {
        code: invite.code,
        email: invite.email,
        expiresAt: invite.expiresAt,
      },
    });
  }

  /**
   * Allows a user to join a team using an invite code.
   * @param req - Request with team ID, invite code, and authenticated user ID.
   * @param res - Response with updated team data.
   */
  async joinTeam(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const teamId = req.params.teamId;
    const { code }: JoinTeamInput = req.body;
    const team = await this._teamService.joinTeam(teamId, userId, code);
    await this._userService.addTeamToUser(userId, teamId);

    await this._notificationService.createNotification(
      teamId,
      `User ${req.user?.email} joined the team`
    );
    const teamDTO: TeamDTO = toTeamDTO(team, req.user?.email);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Joined team successfully',
      data: teamDTO,
    });
  }

  /**
   * Removes a user from a team (Leave Team feature).
   * @param req - Request with team ID, user ID to remove, and authenticated user ID.
   * @param res - Response with success message.
   */
  async leaveTeam(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const teamId = req.params.teamId;
    const memberId = req.params.userId;
    if (userId !== memberId) {
      throw new AppError(
        'You can only leave a team as yourself',
        HttpStatus.FORBIDDEN
      );
    }

    await this._teamService.leaveTeam(teamId, memberId);
    await this._userService.removeTeamFromUser(memberId, teamId);
    await this._notificationService.createNotification(
      teamId,
      `User ${req.user?.email} left the team`
    );

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Left team successfully',
    });
  }
}
