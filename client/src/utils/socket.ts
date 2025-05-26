import io from "socket.io-client";
import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (): void => {
  if (socket) return;
  const token = localStorage.getItem("userToken"); // Get token from localStorage
  socket = io("http://localhost:5000", {
    transports: ["websocket"],
    auth: { token: token ? `Bearer ${token}` : "" }, // Send Bearer token
  });
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;
