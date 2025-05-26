import { create } from "zustand";
import type { ITask, User, Invite, Team, Notification } from "../types";

interface TeamState {
  teams: Team[];
  users: User[];
  teamTasks: ITask[];
  notifications: Notification[];
  addTeam: (team: Team) => void;
  addInvite: (teamId: string, invite: Invite) => void;
  joinTeam: (teamId: string, userId: string) => void;
  leaveTeam: (teamId: string, userId: string) => void;
  addTeamTask: (task: ITask) => void;
  updateTeamTask: (taskId: string, updates: Partial<ITask>) => void;
  deleteTeamTask: (taskId: string) => void;
  addNotification: (notification: Notification) => void;
}

const useTeamStore = create<TeamState>((set) => ({
  teams: [
    {
      id: "team1",
      name: "Project Alpha",
      creatorId: "user1",
      members: ["user1", "user2", "user3"],
      inviteCodes: [
        {
          code: "abc123",
          email: "mike@example.com",
          expiresAt: "2025-05-22T12:00:00Z",
        },
      ],
    },
    {
      id: "team2",
      name: "Marketing Campaign",
      creatorId: "user2",
      members: ["user2", "user4"],
      inviteCodes: [],
    },
  ],
  users: [
    { id: "user1", username: "Alice", email: "alice@example.com", teamIds: ["team1"] },
    { id: "user2", username: "Bob", email: "bob@example.com", teamIds: ["team1", "team2"] },
    { id: "user3", username: "Jane", email: "jane@example.com", teamIds: ["team1"] },
    { id: "user4", username: "Mike", email: "mike@example.com", teamIds: ["team2"] },
  ],
  teamTasks: [
    {
      id: "task1",
      title: "Design Homepage",
      description: "Create wireframes for new homepage",
      status: "todo",
      dueDate: "2025-05-25",
      teamId: "team1",
      assigneeId: "user2",
      creatorId: "user1",
      userId: "user1",
      isStarred: false,
      taskListId: "",
    },
    {
      id: "task2",
      title: "Write Blog Post",
      description: "",
      status: "done",
      dueDate: "2025-05-20",
      teamId: "team1",
      assigneeId: null,
      creatorId: "user3",
      userId: "user3",
      isStarred: false,
      taskListId: "",
    },
  ],
  notifications: [
    {
      id: "notif1",
      message: "Alice created task: Design Homepage",
      teamId: "team1",
      timestamp: "2025-05-21T17:00:00Z",
    },
    {
      id: "notif2",
      message: "Jane completed task: Write Blog Post",
      teamId: "team1",
      timestamp: "2025-05-21T17:05:00Z",
    },
  ],
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  addInvite: (teamId, invite) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? { ...team, inviteCodes: [...team.inviteCodes, invite] }
          : team
      ),
    })),
  joinTeam: (teamId, userId) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? { ...team, members: [...team.members, userId] }
          : team
      ),
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, teamIds: [...(user.teamIds || []), teamId] }
          : user
      ),
    })),
  leaveTeam: (teamId, userId) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? { ...team, members: team.members.filter((id) => id !== userId) }
          : team
      ),
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, teamIds: (user.teamIds || []).filter((id) => id !== teamId) }
          : user
      ),
      teamTasks: state.teamTasks.map((task) =>
        task.teamId === teamId && task.assigneeId === userId
          ? { ...task, assigneeId: null }
          : task
      ),
    })),
  addTeamTask: (task) =>
    set((state) => ({ teamTasks: [...state.teamTasks, task] })),
  updateTeamTask: (taskId, updates) =>
    set((state) => ({
      teamTasks: state.teamTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),
  deleteTeamTask: (taskId) =>
    set((state) => ({
      teamTasks: state.teamTasks.filter((task) => task.id !== taskId),
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
}));

export default useTeamStore;