import api from "../api";
import type { ApiResponse, ITask } from "../types";

const taskService = {
  getTasks: async (taskListId: string): Promise<ApiResponse<ITask[]>> => {
    const response = await api.get(`/tasklist/${taskListId}/tasks`);
    return response.data;
  },

  createTask: async (
    taskListId: string,
    task: Partial<ITask>
  ): Promise<ApiResponse<ITask>> => {
    const response = await api.post(`/tasklist/${taskListId}/tasks`, task);
    return response.data;
  },

  updateTask: async (
    taskListId: string,
    taskId: string,
    task: Partial<ITask>
  ): Promise<ApiResponse<ITask>> => {
    const response = await api.patch(
      `/tasklist/${taskListId}/tasks/${taskId}`,
      task
    );
    return response.data;
  },

  deleteTask: async (
    taskListId: string,
    taskId: string
  ): Promise<ApiResponse<null>> => {
    const response = await api.delete(
      `/tasklist/${taskListId}/tasks/${taskId}`
    );
    return response.data;
  },

  getTaskSummary: async (): Promise<
    ApiResponse<{ done: number; todo: number }>
  > => {
    const response = await api.get("/tasklist/summary");
    return response.data;
  },

  getTaskStats: async (
    days: number = 7
  ): Promise<ApiResponse<{ date: string; tasks: number }[]>> => {
    const response = await api.get(`/tasklist/stats?days=${days}`);
    return response.data;
  },
};

export default taskService;
