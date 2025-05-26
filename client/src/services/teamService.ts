import api from "../api";
import type { ApiResponse, Team, ITask, Notification } from "../types";

const teamService = {
  getTeams: async (): Promise<ApiResponse<Team[]>> => {
    const response = await api.get("/teams");
    return response.data;
  },

  createTeam: async (name: string): Promise<ApiResponse<Team>> => {
    const response = await api.post("/teams", { name });
    return response.data;
  },

  createInvite: async (
    teamId: string,
    email: string
  ): Promise<ApiResponse<{ email: string; expiresAt: string }>> => {
    const response = await api.post(`/teams/${teamId}/invite`, { email });
    return response.data;
  },

  joinTeam: async (
    teamId: string,
    code: string
  ): Promise<ApiResponse<Team>> => {
    console.log("Sending joinTeam request:", { teamId, code });
    try {
      const response = await api.post(`/teams/${teamId}/join`, { code });
      console.log("joinTeam response:", response.data);
      return response.data;
    } catch (error) {
      console.error("joinTeam error:", error);
      throw error;
    }
  },

  joinTeamByCode: async (code: string): Promise<ApiResponse<Team>> => {
    console.log("Sending joinTeamByCode request:", { code });
    try {
      const response = await api.post(`/teams/join-by-code`, { code });
      console.log("joinTeamByCode response:", response.data);
      return response.data;
    } catch (error) {
      console.error("joinTeamByCode error:", error);
      throw error;
    }
  },

  leaveTeam: async (
    teamId: string,
    userId: string
  ): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/teams/${teamId}/leave/${userId}`);
    return response.data;
  },

  getTeamTasks: async (teamId: string): Promise<ApiResponse<ITask[]>> => {
    const response = await api.get(`/teams/${teamId}/tasks`);
    return response.data;
  },

  createTeamTask: async (
    teamId: string,
    task: Partial<ITask>
  ): Promise<ApiResponse<ITask>> => {
    const response = await api.post(`/teams/${teamId}/tasks`, task);
    return response.data;
  },

  updateTeamTask: async (
    teamId: string,
    taskId: string,
    task: Partial<ITask>
  ): Promise<ApiResponse<ITask>> => {
    const response = await api.patch(`/teams/${teamId}/tasks/${taskId}`, task);
    return response.data;
  },

  deleteTeamTask: async (
    teamId: string,
    taskId: string
  ): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/teams/${teamId}/tasks/${taskId}`);
    return response.data;
  },

  getNotifications: async (
    teamId: string
  ): Promise<ApiResponse<Notification[]>> => {
    const response = await api.get(`/teams/${teamId}/notifications`);
    return response.data;
  },
};

export default teamService;
