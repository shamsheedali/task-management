import { ITeam } from '../models/team.model';

export interface ITeamService {
  createTeam(name: string, creatorId: string): Promise<ITeam>;
  getUserTeams(userId: string): Promise<ITeam[]>;
  getTeam(teamId: string, userId: string): Promise<ITeam>;
  createInvite(
    teamId: string,
    creatorId: string,
    email: string
  ): Promise<{ code: string; email: string; expiresAt: Date }>;
  joinTeam(teamId: string, userId: string, code: string): Promise<ITeam>;
  joinTeamByCode(userId: string, code: string): Promise<ITeam>;
  leaveTeam(teamId: string, userId: string): Promise<void>;
}
