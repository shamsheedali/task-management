import React, { useState, useRef, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { Plus, Mail, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import useTeamStore from "../store/teamStore";
import useAuthStore from "../store/authStore";
import MemberCard from "../components/MemberCard";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import type { ITask, User } from "../types";
import { getSocket } from "../utils/socket";

const Team: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const {
    teams,
    users,
    teamTasks,
    addTeamTask,
    updateTeamTask,
    deleteTeamTask,
    addInvite,
    leaveTeam,
    fetchInitialData,
    isLoading,
    error,
  } = useTeamStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"tasks" | "members">("tasks");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskStatus, setTaskStatus] = useState<"todo" | "done">("todo");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const taskModalRef = useRef<HTMLDialogElement>(null);
  const inviteModalRef = useRef<HTMLDialogElement>(null);
  const leaveModalRef = useRef<HTMLDialogElement>(null);

  const currentUserId = user?.id;

  const team = teams.find((t) => t.id === teamId);
  const tasks = teamTasks.filter((t) => t.teamId === teamId);
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const completedTasks = tasks.filter((t) => t.status === "done");
  const isCreator = team?.creatorId === currentUserId;

  useEffect(() => {
    if (teamId && currentUserId) {
      fetchInitialData(teamId);
    }
  }, [teamId, currentUserId, fetchInitialData]);

  useEffect(() => {
    const socket = getSocket();

    if (!teamId || !socket) return;

    socket.on(
      "TASK_CREATED_NOTIFICATION",
      (data: { teamId: string; createdBy: string }) => {
        if (data.teamId === teamId) {
          fetchInitialData(teamId);
        }
      }
    );

    socket.on(
      "TASK_EDIT_NOTIFICATION",
      (data: { teamId: string; editedBy: string }) => {
        if (data.teamId === teamId) {
          fetchInitialData(teamId);
        }
      }
    );

    socket.on(
      "TASK_DELETE_NOTIFICATION",
      (data: { teamId: string; deletedBy: string }) => {
        if (data.teamId === teamId) {
          fetchInitialData(teamId);
        }
      }
    );

    socket.on(
      "TASK_COMPLETED_NOTIFICATION",
      (data: {
        teamId: string;
        taskTitle: string;
        completedBy: string;
        newStatus: string;
      }) => {
        if (data.teamId === teamId) {
          fetchInitialData(teamId);
          toast.info(
            `${data.completedBy} marked task "${data.taskTitle}" as ${data.newStatus}`
          );
        }
      }
    );

    return () => {
      socket.off("TASK_CREATED_NOTIFICATION");
      socket.off("TASK_COMPLETED_NOTIFICATION");
      socket.off("TASK_EDIT_NOTIFICATION");
      socket.off("TASK_DELETE_NOTIFICATION");
    };
  }, [teamId, fetchInitialData]);

  const handleCreateOrUpdateTask = async () => {
    if (!taskTitle.trim()) {
      toast.error("Task title is required", { toastId: "task-title-error" });
      return;
    }
    if (!currentUserId) {
      toast.error("You must be logged in", { toastId: "auth-error" });
      return;
    }

    const taskData: Partial<ITask> = {
      title: taskTitle,
      description: taskDesc || "",
      status: taskStatus,
      dueDate: taskDueDate ? taskDueDate : undefined,
      assigneeId,
      isStarred: false,
      taskListId: "",
      teamId: teamId!,
    };

    try {
      if (editingTaskId) {
        await updateTeamTask(teamId!, editingTaskId, taskData);
        const socket = getSocket();
        socket?.emit("task:edit", {
          teamId: teamId!,
          editedBy: user.username,
        });
      } else {
        await addTeamTask(teamId!, taskData, currentUserId);

        const socket = getSocket();
        if (socket) {
          socket.emit("task:create", {
            teamId: teamId!,
            createdBy: user.username,
          });
        }
      }

      resetTaskModal();
    } catch (error) {
      toast.error("Something went wrong creating task");
      console.error(error);
    }
  };

  const handleEditTask = (task: ITask) => {
    setTaskTitle(task.title);
    setTaskDesc(task.description || "");
    setTaskStatus(task.status);
    setTaskDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    setAssigneeId(task.assigneeId ?? null);
    setEditingTaskId(task.id);
    taskModalRef.current?.showModal();
  };

  const handleUpdateTask = (taskId: string, updatedTask: Partial<ITask>) => {
    updateTeamTask(teamId!, taskId, updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!teamId) {
      toast.error("Team ID is missing", { toastId: "team-id-error" });
      return;
    }
    try {
      deleteTeamTask(teamId, taskId);

      const socket = getSocket();
      if (socket) {
        socket.emit("task:delete", {
          teamId: teamId!,
          deletedBy: user?.username,
        });
      }
    } catch (error) {
      console.error("Error in handleDeleteTask:", error);
      toast.error("Failed to initiate task deletion", {
        toastId: "delete-init-error",
      });
    }
  };

  const handleInvite = () => {
    if (
      !inviteEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)
    ) {
      toast.error("Valid email is required", { toastId: "invite-email-error" });
      return;
    }
    addInvite(teamId!, inviteEmail);
    setInviteEmail("");
    inviteModalRef.current?.close();
  };

  const handleLeaveTeam = () => {
    if (!currentUserId) {
      toast.error("You must be logged in", { toastId: "auth-error" });
      return;
    }
    leaveTeam(teamId!, currentUserId);
    leaveModalRef.current?.close();
    const socket = getSocket();
    socket?.emit("team:leave", {
      teamId,
      teamName: team?.name,
      user: user?.username,
    });
    navigate("/teams");
  };

  const resetTaskModal = () => {
    setTaskTitle("");
    setTaskDesc("");
    setTaskStatus("todo");
    setTaskDueDate("");
    setAssigneeId(null);
    setEditingTaskId(null);
    taskModalRef.current?.close();
  };

  if (!user || !currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            Please log in to view team
          </h1>
          <RouterLink to="/login" className="btn btn-primary mt-4">
            Log In
          </RouterLink>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">{error}</h1>
          <RouterLink to="/teams" className="btn btn-primary mt-4">
            Back to Teams
          </RouterLink>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            Team not found
          </h1>
          <RouterLink to="/teams" className="btn btn-primary mt-4">
            Back to Teams
          </RouterLink>
        </div>
      </div>
    );
  }

  if (!team.members.includes(currentUserId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            You are not a member of this team
          </h1>
          <RouterLink to="/teams" className="btn btn-primary mt-4">
            Back to Teams
          </RouterLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="pt-28 p-8 flex-1">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <RouterLink
                to="/teams"
                className="text-primary-500 hover:underline"
              >
                Teams
              </RouterLink>
              <span className="mx-2">/</span>
              <h1 className="inline text-3xl font-extrabold tracking-tight text-text-primary">
                {team.name}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-primary flex items-center gap-2"
                onClick={() => {
                  setEditingTaskId(null);
                  taskModalRef.current?.showModal();
                }}
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>

          <div className="tabs mb-6">
            <button
              className={`tab tab-lifted ${
                activeTab === "tasks" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>
            <button
              className={`tab tab-lifted ${
                activeTab === "members" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("members")}
            >
              Members
            </button>
          </div>

          {activeTab === "tasks" && (
            <div className="space-y-5 pb-24">
              {tasks.length === 0 ? (
                <div className="text-center text-gray-400">No tasks found.</div>
              ) : (
                <>
                  {todoTasks.length > 0 && (
                    <div className="space-y-5">
                      {todoTasks.map((task) => (
                        <Card
                          key={task.id}
                          task={task}
                          allTasks={tasks}
                          starred={task.isStarred}
                          setTasks={() => {}}
                          onUpdateTask={(updatedTask) =>
                            handleUpdateTask(task.id, updatedTask)
                          }
                          onEditTask={handleEditTask}
                          onDeleteTask={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}
                  {completedTasks.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-text-primary mb-4">
                        Completed Tasks
                      </h3>
                      <div className="space-y-5">
                        {completedTasks.map((task) => (
                          <Card
                            key={task.id}
                            task={task}
                            allTasks={tasks}
                            starred={task.isStarred}
                            setTasks={() => {}}
                            onUpdateTask={(updatedTask) =>
                              handleUpdateTask(task.id, updatedTask)
                            }
                            onEditTask={handleEditTask}
                            onDeleteTask={handleDeleteTask}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  className="btn btn-primary flex items-center gap-2"
                  onClick={() => inviteModalRef.current?.showModal()}
                >
                  <Mail size={20} />
                  Invite Member
                </button>
                {!isCreator && (
                  <button
                    className="btn btn-danger flex items-center gap-2"
                    onClick={() => leaveModalRef.current?.showModal()}
                  >
                    <LogOut size={20} />
                    Leave Team
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {team.members.map((memberId) => {
                  const user = users.find((u) => u.id === memberId);
                  return user ? (
                    <MemberCard
                      key={user.id}
                      user={user}
                      isCreator={user.id === team.creatorId}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <dialog ref={taskModalRef} className="modal">
          <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in">
            <h3 className="font-bold text-lg">
              {editingTaskId ? "Edit Task" : "Create Task"}
            </h3>
            <InputField
              type="text"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="textarea textarea-bordered w-full text-base"
              placeholder="Description"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              rows={2}
            />
            <select
              className="select select-bordered w-full"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value as "todo" | "done")}
            >
              <option value="todo">To Do</option>
              <option value="done">Done</option>
            </select>
            <InputField
              type="date"
              placeholder="Due date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <select
              className="select select-bordered w-full"
              value={assigneeId ?? ""}
              onChange={(e) => setAssigneeId(e.target.value || null)}
            >
              <option value="">Team</option>
              {team.members
                .map((memberId) => users.find((u) => u.id === memberId))
                .filter((user): user is User => !!user)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
            </select>
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCreateOrUpdateTask}
              >
                {editingTaskId ? "Update" : "Create"}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={resetTaskModal}>
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <dialog ref={inviteModalRef} className="modal">
          <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in">
            <h3 className="font-bold text-lg">Invite Member</h3>
            <InputField
              type="email"
              placeholder="Enter email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={handleInvite}>
                Send Invite
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => inviteModalRef.current?.close()}
              >
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <dialog ref={leaveModalRef} className="modal">
          <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in">
            <h3 className="font-bold text-lg">Leave Team</h3>
            <p className="py-4">
              Are you sure you want to leave "{team.name}"? Your assigned tasks
              will be unassigned.
            </p>
            <div className="flex gap-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLeaveTeam}
              >
                Leave
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => leaveModalRef.current?.close()}
              >
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default Team;
