"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Goal, Task } from "./interfaces";

interface GoalTasksProps {
  goal: Goal;
  onComplete: (goalId: number) => void;
  isOffline?: boolean;
}

const GoalTasks: React.FC<GoalTasksProps> = ({ goal, onComplete, isOffline }) => {
  const tasksRef = useRef<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem(`goal_tasks_${goal.id}`);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        tasksRef.current = parsedTasks;
        return parsedTasks;
      }
    }
    
    const defaultTasks = [
      { id: 1, name: goal.daily_action, completed: false },
      { id: 2, name: goal.daily_learning, completed: false },
      { id: 3, name: goal.daily_visualization, completed: false },
    ];
    tasksRef.current = defaultTasks;
    return defaultTasks;
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`goal_tasks_${goal.id}`, JSON.stringify(tasks));
      }
    }, 500); // Debounce ukládání

    return () => clearTimeout(timeoutId);
  }, [tasks, goal.id]);

  useEffect(() => {
    const allDone = tasks.every((task) => task.completed);
    if (allDone && !tasksEqual(tasks, tasksRef.current)) {
      tasksRef.current = [...tasks];
      onComplete(goal.id);
    }
  }, [tasks, goal.id, onComplete]);

  const tasksEqual = (tasks1: Task[], tasks2: Task[]): boolean => {
    if (tasks1.length !== tasks2.length) return false;
    return tasks1.every((task, index) => 
      task.id === tasks2[index].id && 
      task.completed === tasks2[index].completed
    );
  };

  const toggleTaskCompletion = useCallback((taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = (completedCount / totalTasks) * 100;
  const isCompleted = progressPercent === 100;

  const emojiMap = {
    1: { completed: "✅", notCompleted: "💪🏼" },
    2: { completed: "✅", notCompleted: "📚" },
    3: { completed: "✅", notCompleted: "🧘‍♂️" },
  };

  return (
    <div key={goal.id} className="mt-6 text-left relative">
      <h3 className="text-white font-medium">
        {goal.goal_name}
        {isOffline && <span className="ml-2 text-yellow-500 text-sm">(Offline)</span>}
      </h3>

      {/* Checkboxy úkolů */}
      <div className="mt-4">
        {tasks.map((task) => {
          const emoji = task.completed
            ? emojiMap[task.id as keyof typeof emojiMap].completed
            : emojiMap[task.id as keyof typeof emojiMap].notCompleted;

          return (
            <div key={task.id} className="flex items-center mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 flex items-center justify-center border-2 border-gray-300 rounded-md transition-all duration-300 peer-checked:bg-purple-500 peer-checked:border-purple-500">
                  <svg
                    className="hidden w-4 h-4 text-white peer-checked:block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </label>
              <span className="ml-3 text-lg select-none transition-all duration-300 ease-in-out">
                {emoji} {task.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isCompleted ? "bg-green-500" : "bg-purple-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Překryvná vrstva pro dokončené úkoly */}
      {isCompleted && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-2 block">🎉</span>
            <span className="text-white text-xl font-medium">
              {isOffline ? "Pro dnešek splněno (bude synchronizováno)" : "Pro dnešek splněno"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTasks; 