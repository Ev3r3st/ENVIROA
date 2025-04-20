"use client";

import React from "react";
import { Goal } from "./interfaces";

interface GoalListProps {
  goals: Goal[];
}

const GoalList: React.FC<GoalListProps> = ({ goals }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full text-center my-6">
      <h2 className="text-lg font-semibold border-b border-gray-600 pb-2">
        Moje cíle
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-gray-700 p-4 rounded-lg text-left"
          >
            <h3 className="text-white font-medium">{goal.goal_name}</h3>
            <p className="text-gray-400 text-sm mt-2">
              Doba trvání: {goal.duration} dní
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalList; 