"use client";

import React from "react";
import { Goal } from "./interfaces";
import GoalTasks from "./GoalTasks";

export interface DailyTasksSectionProps {
  goals: Goal[];
  onComplete: (goalId: number) => void;
  isOffline?: boolean;
}

const DailyTasksSection: React.FC<DailyTasksSectionProps> = ({ goals, onComplete, isOffline }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full text-center">
      <h2 className="text-lg font-semibold border-b border-gray-600 pb-2">
        📌 Dnešní úkoly
        {isOffline && <span className="ml-2 text-yellow-500 text-sm">(Offline režim)</span>}
      </h2>
      <div className="mt-4">
        {goals.map((goal) => (
          <GoalTasks
            key={goal.id}
            goal={goal}
            onComplete={onComplete}
            isOffline={isOffline}
          />
        ))}
      </div>
      <button 
        className={`mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg transition-all duration-300 ${
          isOffline ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
        disabled={isOffline}
      >
        ✅ Dokončit úkoly
      </button>
    </div>
  );
};

export default DailyTasksSection; 