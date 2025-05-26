import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import taskService from "../services/taskService";

const COLORS = ["#10b981", "#ef4444"]; // Green for Done, Red for To-Do

const Stats: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch Task Summary (Pie Chart)
  const {
    data: taskSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["taskSummary"],
    queryFn: async () => {
      const response = await taskService.getTaskSummary();
      return [
        { name: "Done", value: response.data.done },
        { name: "To-Do", value: response.data.todo },
      ];
    },
  });

  // Fetch Task Stats (Line Chart)
  const {
    data: taskStats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["taskStats"],
    queryFn: async () => {
      const response = await taskService.getTaskStats();
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 pt-20">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-white">Stats</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart: Tasks Done vs To-Do */}
          <div className="bg-card dark:bg-neutral-800 backdrop-blur-lg p-6 rounded-lg shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-text-primary">
              Task Status
            </h2>
            {summaryLoading ? (
              <p className="text-text-secondary">Loading...</p>
            ) : summaryError ? (
              <p className="text-red-400">Error loading task summary</p>
            ) : (
              <>
                <div className="flex justify-center">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={taskSummary}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                    >
                      {taskSummary?.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </div>
                {/* Legend */}
                <div className="mt-4 flex justify-center gap-6">
                  {taskSummary?.map((_, index) => (
                    <div
                      key={taskSummary[index].name}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm text-text-secondary">
                        {taskSummary[index].name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Line Chart: Tasks Over Time */}
          <div className="bg-card dark:bg-neutral-800 backdrop-blur-lg p-6 rounded-lg shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-text-primary">
              Tasks Completed Over Time
            </h2>
            {statsLoading ? (
              <p className="text-text-secondary">Loading...</p>
            ) : statsError ? (
              <p className="text-red-400">Error loading task stats</p>
            ) : (
              <>
                <LineChart
                  width={500}
                  height={300}
                  data={taskStats}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="date" stroke="#d1d5db" />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
                {/* Legend */}
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                    <span className="text-sm text-text-secondary">
                      Tasks Completed
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
