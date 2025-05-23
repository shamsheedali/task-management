import { create } from "zustand";
import type { ITask, User, Team, Notification } from "../types";
import { toast } from "react-toastify";
import teamService from "../services/teamService";
import userService from "../services/userService";

interface TeamState {
  teams: Team[];
  users: User[];
  teamTasks: ITask[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchInitialData: (teamId?: string) => Promise<void>;
  addTeam: (name: string) => Promise<void>;
  addInvite: (teamId: string, email: string) => Promise<void>;
  joinTeam: (teamId: string, code: string) => Promise<void>;
  joinTeamByCode: (code: string) => Promise<void>;
  leaveTeam: (teamId: string, userId: string) => Promise<void>;
  addTeamTask: (
    teamId: string,
    task: Partial<ITask>,
    creatorId: string
  ) => Promise<void>;
  updateTeamTask: (
    teamId: string,
    taskId: string,
    updates: Partial<ITask>
  ) => Promise<void>;
  deleteTeamTask: (teamId: string, taskId: string) => Promise<void>;
  addNotification: (teamId: string, message: string) => Promise<void>;
}

const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  users: [],
  teamTasks: [],
  notifications: [],
  isLoading: false,
  error: null,

  fetchInitialData: async (teamId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const [teamsResponse, usersResponse] = await Promise.all([
        teamService.getTeams(),
        userService.getUsers(),
      ]);
      const teams = teamsResponse.data;
      const users = usersResponse.data;

      let teamTasks: ITask[] = [];
      let notifications: Notification[] = [];

      if (teamId) {
        const [tasksResponse, notificationsResponse] = await Promise.all([
          teamService.getTeamTasks(teamId),
          teamService.getNotifications(teamId),
        ]);
        teamTasks = tasksResponse.data;
        notifications = notificationsResponse.data;
      }

      set({
        teams,
        users,
        teamTasks,
        notifications,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch team data";
      set({ error: message, isLoading: false });
      toast.error(message, { toastId: "fetch-error" });
    }
  },

  addTeam: async (name: string) => {
    try {
      const response = await teamService.createTeam(name);
      set((state) => ({ teams: [...state.teams, response.data] }));
      toast.success("Team created successfully");
    } catch (error) {
      toast.error("Failed to create team", { toastId: "create-team-error" });
    }
  },

  addInvite: async (teamId: string, email: string) => {
    try {
      const response = await teamService.createInvite(teamId, email);
      set((state) => ({
        teams: state.teams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                inviteCodes: [
                  ...team.inviteCodes,
                  {
                    email: response.data.email,
                    expiresAt: response.data.expiresAt,
                  },
                ],
              }
            : team
        ),
      }));
      await get().addNotification(teamId, `Invited ${email} to the team`);
      toast.success("Invite sent");
    } catch (error) {
      toast.error("Failed to send invite", { toastId: "invite-error" });
    }
  },

  joinTeam: async (teamId: string, code: string) => {
    try {
      const response = await teamService.joinTeam(teamId, code);
      set((state) => ({
        teams: state.teams.map((team) =>
          team.id === teamId ? response.data : team
        ),
        users: state.users.map((user) =>
          user.id === response.data.members[response.data.members.length - 1]
            ? { ...user, teamIds: [...(user.teamIds || []), teamId] }
            : user
        ),
      }));
      await get().addNotification(teamId, `A user joined the team`);
      toast.success(`Joined team: ${response.data.name}`);
    } catch (error) {
      console.error("joinTeam error:", error);
      toast.error("Failed to join team", { toastId: "join-error" });
      throw error;
    }
  },

  joinTeamByCode: async (code: string) => {
    try {
      const response = await teamService.joinTeamByCode(code);
      const teamId = response.data.id;
      set((state) => ({
        teams: state.teams.some((team) => team.id === teamId)
          ? state.teams.map((team) =>
              team.id === teamId ? response.data : team
            )
          : [...state.teams, response.data],
        users: state.users.map((user) =>
          user.id === response.data.members[response.data.members.length - 1]
            ? { ...user, teamIds: [...(user.teamIds || []), teamId] }
            : user
        ),
      }));
      await get().addNotification(teamId, `A user joined the team`);
      toast.success(`Joined team: ${response.data.name}`);
    } catch (error) {
      console.error("joinTeamByCode error:", error);
      toast.error("Failed to join team", { toastId: "join-error" });
      throw error;
    }
  },

  leaveTeam: async (teamId: string, userId: string) => {
    try {
      await teamService.leaveTeam(teamId, userId);
      set((state) => ({
        teams: state.teams.map((team) =>
          team.id === teamId
            ? { ...team, members: team.members.filter((id) => id !== userId) }
            : team
        ),
        users: state.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                teamIds: (user.teamIds || []).filter((id) => id !== teamId),
              }
            : user
        ),
        teamTasks: state.teamTasks.map((task) =>
          task.teamId === teamId && task.assigneeId === userId
            ? { ...task, assigneeId: null }
            : task
        ),
      }));
      await get().addNotification(teamId, `A user left the team`);
      toast.success("You have left the team");
    } catch (error) {
      toast.error("Failed to leave team", { toastId: "leave-error" });
    }
  },

  addTeamTask: async (
    teamId: string,
    task: Partial<ITask>,
    creatorId: string
  ) => {
    try {
      const response = await teamService.createTeamTask(teamId, {
        ...task,
        creatorId,
        userId: creatorId,
      });
      set((state) => ({
        teamTasks: [...state.teamTasks, response.data],
      }));
      await get().addNotification(
        teamId,
        `Created task: ${response.data.title}`
      );
      toast.success("Task created");
    } catch (error) {
      toast.error("Failed to create task", { toastId: "create-task-error" });
    }
  },

  updateTeamTask: async (
    teamId: string,
    taskId: string,
    updates: Partial<ITask>
  ) => {
    try {
      const response = await teamService.updateTeamTask(
        teamId,
        taskId,
        updates
      );
      set((state) => ({
        teamTasks: state.teamTasks.map((task) =>
          task.id === taskId ? response.data : task
        ),
      }));
      await get().addNotification(
        teamId,
        `Updated task: ${response.data.title}`
      );
      toast.success("Task updated");
    } catch (error) {
      toast.error("Failed to update task", { toastId: "update-task-error" });
    }
  },

  deleteTeamTask: async (teamId: string, taskId: string) => {
    try {
      await teamService.deleteTeamTask(teamId, taskId);
      set((state) => ({
        teamTasks: state.teamTasks.filter((task) => task.id !== taskId),
      }));
      await get().addNotification(teamId, `Deleted a task`);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task", { toastId: "delete-task-error" });
    }
  },

  addNotification: async (teamId: string, message: string) => {
    try {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        message,
        teamId,
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        notifications: [...state.notifications, notification],
      }));
    } catch (error) {
      toast.error("Failed to add notification", {
        toastId: "notification-error",
      });
    }
  },
}));

export default useTeamStore;
