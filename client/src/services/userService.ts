import api from "../api";
import type { ApiResponse, User } from "../types";

const userService = {
  signUp: async (userData: {
    email: string;
    password: string;
    username?: string;
  }): Promise<ApiResponse<{ accessToken: string }>> => {
    const response = await api.post("/users/register", userData);
    if (response.status === 200) {
      localStorage.setItem("userEmail", userData.email);
      return response.data;
    }
    throw new Error("Signup failed");
  },
  login: async (userData: {
    email: string;
    password: string;
  }): Promise<ApiResponse<User>> => {
    const response = await api.post("/users/login", userData);
    if (response.status === 200) {
      localStorage.setItem("userToken", response.data.accessToken);
      return response.data;
    }
    throw new Error("Login failed");
  },
  verifyOtp: async (otpCode: string): Promise<ApiResponse<User>> => {
    const email = localStorage.getItem("userEmail");
    const response = await api.post("/users/verify-and-register", {
      email,
      otp: otpCode,
    });
    if (response.status === 201) {
      localStorage.removeItem("userEmail");
      localStorage.setItem("userToken", response.data.accessToken);
      return response.data;
    }
    throw new Error("Otp not verified");
  },

  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get("/users");
    return response.data;
  },
};

export default userService;
