import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useTeamStore from "../store/teamStore";
import useAuthStore from "../store/authStore";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";

const JoinTeam: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { joinTeamByCode, fetchInitialData, isLoading, error } = useTeamStore();
  const { user } = useAuthStore();
  const [inviteCode, setInviteCode] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setInviteCode(code);
    }
  }, [searchParams]);

  const handleJoinTeam = async () => {
    if (!inviteCode) {
      toast.error("Invite code is required", { toastId: "join-error" });
      return;
    }
    if (!user?.id) {
      toast.error("You must be logged in", { toastId: "auth-error" });
      return;
    }
    try {
      await joinTeamByCode(inviteCode);
      navigate("/teams");
    } catch (error) {
      toast.error("Failed to join team. Invalid invite code.", {
        toastId: "join-error",
      });
    }
  };

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
            <button className="btn btn-primary w-full" onClick={handleJoinTeam}>
              Join Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTeam;
