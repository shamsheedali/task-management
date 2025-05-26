import { create } from "zustand";
import type { ITask, User, Team, Notification } from "../types";
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
  addNotification: (teamId: string, message: string) => void;
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
  },

  addTeam: async (name: string) => {
    const response = await teamService.createTeam(name);
    set((state) => ({ teams: [...state.teams, response.data] }));
  },

  addInvite: async (teamId: string, email: string) => {
    const response = await teamService.createInvite(teamId, email);
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              inviteCodes: [
                ...(team.inviteCodes || []),
                {
                  code: response.data.code,
                  email: response.data.email,
                  expiresAt: response.data.expiresAt.toISOString(),
                },
              ],
            }
          : team
      ),
    }));
    get().addNotification(teamId, `Invited ${email} to the team`);
  },

  joinTeam: async (teamId: string, code: string) => {
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
    get().addNotification(teamId, `A user joined the team`);
  },

  joinTeamByCode: async (code: string) => {
    const response = await teamService.joinTeamByCode(code);
    const teamId = response.data.id;
    set((state) => ({
      teams: state.teams.some((team) => team.id === teamId)
        ? state.teams.map((team) => (team.id === teamId ? response.data : team))
        : [...state.teams, response.data],
      users: state.users.map((user) =>
        user.id === response.data.members[response.data.members.length - 1]
          ? { ...user, teamIds: [...(user.teamIds || []), teamId] }
          : user
      ),
    }));
    get().addNotification(teamId, `A user joined the team`);
  },

  leaveTeam: async (teamId: string, userId: string) => {
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
    get().addNotification(teamId, `A user left the team`);
  },

  addTeamTask: async (
    teamId: string,
    task: Partial<ITask>,
    creatorId: string
  ) => {
    const response = await teamService.createTeamTask(teamId, {
      ...task,
      creatorId,
      userId: creatorId,
      teamId,
    });
    set((state) => ({
      teamTasks: [...state.teamTasks, response.data],
    }));
    get().addNotification(teamId, `Created task: ${response.data.title}`);
  },

  updateTeamTask: async (
    teamId: string,
    taskId: string,
    updates: Partial<ITask>
  ) => {
    const response = await teamService.updateTeamTask(teamId, taskId, {
      ...updates,
      teamId,
    });
    set((state) => ({
      teamTasks: state.teamTasks.map((task) =>
        task.id === taskId ? response.data : task
      ),
    }));
    get().addNotification(teamId, `Updated task: ${response.data.title}`);
  },

  deleteTeamTask: async (teamId: string, taskId: string) => {
    await teamService.deleteTeamTask(teamId, taskId);
    set((state) => ({
      teamTasks: state.teamTasks.filter((task) => task.id !== taskId),
    }));
    get().addNotification(teamId, `Deleted a task`);
  },

  addNotification: (teamId: string, message: string) => {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      teamId,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },
}));

export default useTeamStore;
