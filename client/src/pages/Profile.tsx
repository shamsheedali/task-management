import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("auth-storage");
    toast.success("Logout successful");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 pt-20">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="p-8 max-w-md w-full bg-card dark:bg-neutral-800 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <div className="avatar">
          <div className="w-16 rounded-full ring ring-primary-500 ring-offset-2">
            <img
              src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
              alt="User avatar"
            />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-text-primary">
            {user?.username || "N/A"}
          </h2>
          <p className="text-text-secondary">{user?.email || "N/A"}</p>
        </div>
        <button className="btn btn-primary w-full" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
