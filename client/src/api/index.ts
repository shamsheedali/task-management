import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    switch (error.response?.status) {
      case 400:
        toast.error(message, { toastId: "bad-request" });
        break;
      case 401:
        toast.error("Please log in to continue", { toastId: "unauthorized" });
        break;
      case 404:
        toast.error("Resource not found", { toastId: "not-found" });
        break;
      case 409:
        toast.error(message, { toastId: "conflict" });
        break;
      default:
        toast.error("Something went wrong", { toastId: "server-error" });
        console.error("API error:", error);
    }
    return Promise.reject(error);
  }
);

export default api;
