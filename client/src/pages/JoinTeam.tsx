import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useTeamStore from "../store/teamStore";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";

const JoinTeam: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { teams, joinTeam } = useTeamStore();
  const [inviteCode, setInviteCode] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentUserId = "user1"; // Dummy current user

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setInviteCode(code);
    }
  }, [searchParams]);

  const handleJoinTeam = () => {
    const invite = teams
      .flatMap((team) => team.inviteCodes)
      .find((inv) => inv.code === inviteCode);
    if (!invite) {
      toast.error("Invalid or expired invite code", { toastId: "invite-error" });
      return;
    }
    const team = teams.find((t) => t.inviteCodes.includes(invite));
    if (team) {
      joinTeam(team.id, currentUserId);
      toast.success(`Joined team: ${team.name}`);
      navigate(`/team/${team.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="pt-28 flex-1 flex items-center justify-center">
        <div className="p-8 max-w-md w-full bg-card dark:bg-neutral-800 backdrop-blur-lg rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Join Team</h1>
          <div className="space-y-4">
            <InputField
              type="text"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              autoFocus
            />
            <button
              className="btn btn-primary w-full"
              onClick={handleJoinTeam}
            >
              Join Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTeam;