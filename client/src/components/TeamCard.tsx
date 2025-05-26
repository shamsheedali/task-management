import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import useTeamStore from "../store/teamStore";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    creatorId: string;
    members: string[];
    inviteCodes: { code: string; email: string; expiresAt: string }[];
  };
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const { users } = useTeamStore();
  const creator = users.find((u) => u.id === team.creatorId);

  return (
    <div className="bg-card dark:bg-neutral-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-700 transition hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{team.name}</h3>
          <p className="text-sm text-gray-500">
            Created by: {creator ? creator.username : "Unknown"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {team.members.length} member{team.members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to={`/team/${team.id}`}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <Users size={16} />
          View
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;