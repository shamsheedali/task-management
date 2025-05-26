import io from "socket.io-client";
import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const connectSocket = (): void => {
  if (socket) return;
  const token = localStorage.getItem("userToken");
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token: token ? `Bearer ${token}` : "" },
  });
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;
