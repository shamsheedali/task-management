import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useTeamStore from "../store/teamStore";
import useAuthStore from "../store/authStore";
import TeamCard from "../components/TeamCard";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
// import type { Team, Invite } from "../types";
import { getSocket } from "../utils/socket";

const Teams: React.FC = () => {
  const {
    teams,
    // users,
    addTeam,
    joinTeamByCode,
    deleteTeam,
    fetchInitialData,
    isLoading,
    error,
  } = useTeamStore();
  const { user } = useAuthStore();
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const inviteModalRef = useRef<HTMLDialogElement>(null);
  const currentUserId = user?.id;

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Team name is required", { toastId: "team-name-error" });
      return;
    }
    addTeam(teamName);
    setTeamName("");
    modalRef.current?.close();
  };

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      toast.error("Invite code is required", { toastId: "invite-code-error" });
      return;
    }
    try {
      await joinTeamByCode(inviteCode);
      setInviteCode("");
      inviteModalRef.current?.close();
      await fetchInitialData();

      // Emit socket event after successful join
      const socket = getSocket();
      if (socket && user) {
        socket.emit("TEAM_USER_JOINED", {
          inviteCode: inviteCode,
          userId: user.id,
          username: user.username || user.email,
        });
      }
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("Failed to join team. Invalid invite code.", {
        toastId: "join-error",
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      toast.success("Team deleted successfully", { toastId: "delete-success" });
      await fetchInitialData();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team", { toastId: "delete-error" });
    }
  };

  if (!user || !currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            Please log in to view teams
          </h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
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
                    <TeamCard
                      key={team.id}
                      team={team}
                      onDelete={() => handleDeleteTeam(team.id)}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="mt-12">
            <button
              className="btn btn-outline btn-primary mb-4"
              onClick={() => inviteModalRef.current?.showModal()}
            >
              Join Team with Code
            </button>
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
            <button className="btn btn-primary btn-sm" onClick={handleJoinTeam}>
              Join
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setInviteCode("");
                inviteModalRef.current?.close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Teams;
