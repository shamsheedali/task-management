import { inject, injectable } from 'inversify';
import TYPES from '../../types/inversify.types';
import { ITeam, IInvite } from '../models/team.model';
import { IUserRepository } from '../../users/interfaces/user-repository.interface';
import { AppError } from '../../utils/appError';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import logger from '../../utils/logger';
import BaseService from '../../common/services/base.service';
import { env } from '../../config/env';
import { ITeamService } from '../interfaces/team-service.interface';
import { ITeamRepository } from '../interfaces/team-repository.interface';

@injectable()
export default class TeamService
  extends BaseService<ITeam>
  implements ITeamService
{
  private _teamRepository: ITeamRepository;
  private _userRepository: IUserRepository;

  constructor(
    @inject(TYPES.TeamRepository) teamRepository: ITeamRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository
  ) {
    super(teamRepository);
    this._teamRepository = teamRepository;
    this._userRepository = userRepository;
  }

  async createTeam(name: string, creatorId: string): Promise<ITeam> {
    const user = await this._userRepository.findById(creatorId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const existingTeam = await this._teamRepository.findOne({
      name,
      creatorId,
    });
    if (existingTeam) {
      throw new AppError(
        `Team with name '${name}' already exists for this creator`,
        HttpStatus.BAD_REQUEST
      );
    }

    const team = await super.create({
      name,
      creatorId,
      members: [creatorId],
      inviteCodes: [],
    });

    logger.info(`Team created: ${team._id} by user: ${creatorId}`);
    return team;
  }

  async getUserTeams(userId: string): Promise<ITeam[]> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const teams = await this._teamRepository.find({ members: userId });
    logger.info(`Retrieved ${teams.length} teams for user: ${userId}`);
    return teams;
  }

  async getTeam(teamId: string, userId: string): Promise<ITeam> {
    const team = await super.findById(teamId);
    if (!team) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!team.members.includes(userId)) {
      throw new AppError(
        'User is not a member of this team',
        HttpStatus.FORBIDDEN
      );
    }

    logger.info(`Team retrieved: ${teamId} for user: ${userId}`);
    return team;
  }

  async createInvite(
    teamId: string,
    creatorId: string,
    email: string
  ): Promise<{ code: string; email: string; expiresAt: Date }> {
    const team = await super.findById(teamId);
    if (!team) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (team.creatorId !== creatorId) {
      throw new AppError(
        'Only the team creator can generate invites',
        HttpStatus.FORBIDDEN
      );
    }

    const code = `inv-${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = new Date(Date.now() + env.INVITE_EXPIRY_MS);
    const invite = { code, email, expiresAt };

    await this._teamRepository.update(teamId, {
      $push: { inviteCodes: invite },
    });

    logger.info(
      `Invite created for team: ${teamId}, email: ${email}, CODE: ${code}`
    );
    return invite;
  }

  async joinTeam(teamId: string, userId: string, code: string): Promise<ITeam> {
    const team = await super.findById(teamId);
    if (!team) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info('JoinTeam Input:', {
      teamId,
      userId,
      code,
      userEmail: user.email,
    });
    logger.info('Team Invite Codes:', team.inviteCodes);

    const invite = team.inviteCodes.find(
      (inv: IInvite) => inv.code === code && inv.expiresAt > new Date()
    );
    if (!invite) {
      logger.info('Invite Validation Failed:', {
        providedCode: code,
        inviteExists: !!invite,
      });
      throw new AppError(
        'Invalid or expired invite code',
        HttpStatus.BAD_REQUEST
      );
    }

    if (team.members.includes(userId)) {
      throw new AppError(
        'User is already a member of this team',
        HttpStatus.BAD_REQUEST
      );
    }

    const updatedTeam = await this._teamRepository.update(teamId, {
      $push: { members: userId },
      $pull: { inviteCodes: { code } },
    });

    if (!updatedTeam) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info(`User ${userId} joined team: ${teamId}`);
    return updatedTeam;
  }

  async joinTeamByCode(userId: string, code: string): Promise<ITeam> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const team = await this._teamRepository.findOne({
      'inviteCodes.code': code,
      'inviteCodes.expiresAt': { $gt: new Date() },
    });
    if (!team) {
      logger.info('JoinTeamByCode Failed:', {
        providedCode: code,
        userId,
        userEmail: user.email,
      });
      throw new AppError(
        'Invalid or expired invite code',
        HttpStatus.BAD_REQUEST
      );
    }

    const invite = team.inviteCodes.find(
      (inv: IInvite) => inv.code === code && inv.expiresAt > new Date()
    );
    if (!invite || invite.email !== user.email) {
      throw new AppError(
        'Invite code is not valid for this user',
        HttpStatus.BAD_REQUEST
      );
    }

    return this.joinTeam(team._id, userId, code);
  }

  async leaveTeam(teamId: string, userId: string): Promise<void> {
    const team = await super.findById(teamId);
    if (!team) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!team.members.includes(userId)) {
      throw new AppError(
        'User is not a member of this team',
        HttpStatus.BAD_REQUEST
      );
    }

    if (team.creatorId === userId) {
      throw new AppError(
        'Team creator cannot leave the team',
        HttpStatus.FORBIDDEN
      );
    }

    await this._teamRepository.update(teamId, {
      $pull: { members: userId },
    });

    logger.info(`User ${userId} left team: ${teamId}`);
  }
}
