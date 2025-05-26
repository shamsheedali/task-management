import React, { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import useTeamStore from "../store/teamStore";
import TeamCard from "../components/TeamCard";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import type { Team, Invite } from "../types";

const Teams: React.FC = () => {
  const { teams, users, addTeam, joinTeam } = useTeamStore();
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const inviteModalRef = useRef<HTMLDialogElement>(null);
  const currentUserId = "user1"; // Dummy current user

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Team name is required", { toastId: "team-name-error" });
      return;
    }
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamName,
      creatorId: currentUserId,
      members: [currentUserId],
      inviteCodes: [],
    };
    addTeam(newTeam);
    toast.success("Team created successfully");
    setTeamName("");
    modalRef.current?.close();
  };

  const handleJoinTeam = () => {
    const invite = teams
      .flatMap((team: Team) => team.inviteCodes)
      .find((inv: Invite) => inv.code === inviteCode);
    if (!invite) {
      toast.error("Invalid or expired invite code", {
        toastId: "invite-error",
      });
      return;
    }
    const team = teams.find((t) => t.inviteCodes.includes(invite));
    if (team) {
      joinTeam(team.id, currentUserId);
      toast.success(`Joined team: ${team.name}`);
      inviteModalRef.current?.close();
      setInviteCode("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="pt-28 p-8 flex-1">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Your Teams
            </h1>
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={() => modalRef.current?.showModal()}
            >
              <Plus size={20} />
              Create Team
            </button>
          </div>

          <div className="space-y-6">
            {teams.length === 0 ? (
              <div className="text-center text-gray-400">No teams found.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {teams
                  .filter((team) => team.members.includes(currentUserId))
                  .map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
              </div>
            )}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">
              Pending Invites
            </h2>
            <button
              className="btn btn-outline btn-primary mb-4"
              onClick={() => inviteModalRef.current?.showModal()}
            >
              Join Team with Code
            </button>
            <div className="space-y-4">
              {teams.flatMap((team: Team) =>
                team.inviteCodes
                  .filter(
                    (inv: Invite) =>
                      inv.email ===
                      users.find((u) => u.id === currentUserId)?.email
                  )
                  .map((inv: Invite) => (
                    <div
                      key={inv.code}
                      className="bg-card dark:bg-neutral-800 p-4 rounded-xl shadow"
                    >
                      <p>
                        Invited to{" "}
                        <strong>
                          {teams.find((t) => t.inviteCodes.includes(inv))?.name}
                        </strong>{" "}
                        by{" "}
                        {
                          users.find(
                            (u) =>
                              u.id ===
                              teams.find((t) => t.inviteCodes.includes(inv))
                                ?.creatorId
                          )?.username
                        }
                      </p>
                      <button
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() => {
                          setInviteCode(inv.code);
                          handleJoinTeam();
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in">
          <h3 className="font-bold text-lg">Create Team</h3>
          <InputField
            type="text"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCreateTeam}
            >
              Create
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => modalRef.current?.close()}
            >
              Cancel
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog ref={inviteModalRef} className="modal">
        <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in">
          <h3 className="font-bold text-lg">Join Team</h3>
          <InputField
            type="text"
            placeholder="Enter invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleJoinTeam}
            >
              Join
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => inviteModalRef.current?.close()}
            >
              Cancel
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Teams;