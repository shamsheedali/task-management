import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import MainApp from "./pages/MainApp";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Teams from "./pages/Teams";
import Team from "./pages/Team";
import JoinTeam from "./pages/JoinTeam";
import { connectSocket, getSocket } from "./utils/socket";

const queryClient = new QueryClient();

export default function App() {
  const isSocketInitialized = useRef(false);

  useEffect(() => {
    if (!isSocketInitialized.current) {
      connectSocket();
      const socket = getSocket();

      if (socket) {
        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.on("connect_error", (error) => {
          console.log("Socket connection error:", error.message);
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });

        socket.on("TEAM_USER_JOINED", ({ username }) => {
          toast.success(`${username} joined the team 🎉`);
        });

        socket.on("TASK_CREATED_NOTIFICATION", ({ createdBy, message }) => {
          toast.info(message ?? "A new task was created", {
            toastId: `task-created-${createdBy}`,
          });
        });

        socket.on("TASK_EDIT_NOTIFICATION", ({ editedBy, message }) => {
          toast.info(message ?? "A task was edited", {
            toastId: `task-edit-${editedBy}`,
          });
        });

        socket.on("TASK_DELETE_NOTIFICATION", ({ deletedBy, message }) => {
          toast.info(message ?? "A task was deleted", {
            toastId: `task-delete-${deletedBy}`,
          });
        });

        socket.on("USER_LEAVE_TEAM", ({ teamName, message }) => {
          toast.info(message ?? "A user leaved from team", {
            toastId: `team-leave-${teamName}`,
          });
        });
      }

      isSocketInitialized.current = true;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/:teamId"
            element={
              <ProtectedRoute>
                <Team />
              </ProtectedRoute>
            }
          />
          <Route
            path="/join"
            element={
              <ProtectedRoute>
                <JoinTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
