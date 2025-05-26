export interface InviteDTO {
  code: string;
  email: string;
}

export interface TeamDTO {
  id: string;
  name: string;
  creatorId: string;
  members: string[];
  inviteCodes: InviteDTO[];
  createdAt: Date;
}

export const toTeamDTO = (
  team: {
    _id: string;
    name: string;
    creatorId: string;
    members: string[];
    inviteCodes: { code: string; email: string; expiresAt: Date }[];
    createdAt: Date;
    updatedAt?: Date;
  },
  userEmail?: string
): TeamDTO => ({
  id: team._id,
  name: team.name,
  creatorId: team.creatorId,
  members: team.members,
  inviteCodes: team.inviteCodes
    .filter(invite => !userEmail || invite.email === userEmail)
    .map(invite => ({
      code: invite.code,
      email: invite.email,
    })),
  createdAt: team.createdAt,
});
