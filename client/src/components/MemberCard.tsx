import React from "react";
import { Crown } from "lucide-react";

interface MemberCardProps {
  user: {
    id: string;
    username: string;
    email: string;
  };
  isCreator: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ user, isCreator }) => {
  return (
    <div className="bg-card dark:bg-neutral-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-neutral-700 transition hover:shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-12 rounded-full ring ring-primary-500 ring-offset-2">
            <img
              src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
              alt={`${user.username}'s avatar`}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-text-primary">{user.username}</h3>
            {isCreator && <Crown size={16} className="text-yellow-500" />}
          </div>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;