"use client";

import React, { useState, useEffect } from "react";
import GoalEdit from "./GoalEdit/GoalEdit";

// Rozhraní cíle
interface Goal {
  id: number;
  goal_name: string;
  duration?: number;
  // ... další pole dle potřeby
}

// Rozhraní props
interface TabbedGoalsProps {
  goals: Goal[];
  onGoalUpdated?: (updatedGoal: Goal) => void;
}

export default function TabbedGoals({ goals, onGoalUpdated }: TabbedGoalsProps) {
  // Stav pro vybranou záložku (index)
  const [activeTab, setActiveTab] = useState<number>(0);
  // Místní stav pro cíle, aby se daly aktualizovat lokálně
  const [localGoals, setLocalGoals] = useState<Goal[]>(goals);

  // Synchronizace při změně props goals
  useEffect(() => {
    setLocalGoals(goals);
    if (activeTab >= goals.length) {
      setActiveTab(0);
    }
  }, [goals]);

  // Pokud uživatel nemá žádné cíle
  if (!localGoals || localGoals.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 my-6">
        <h2 className="text-xl font-bold text-white mb-4">Moje cíle</h2>
        <p className="text-white text-center">Nemáte žádné cíle k úpravě</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 my-6 max-w-4xl w-full mx-auto shadow-lg">
      {/* Nadpis sekce */}
      <h2 className="text-2xl text-white font-bold border-b border-gray-600 pb-2 mb-4">
        Moje cíle
      </h2>

      {/* Lišta záložek */}
      <div className="flex overflow-x-auto gap-4 mb-4">
        {localGoals.map((goal, index) => {
          const isActive = index === activeTab;
          return (
            <button
              key={goal.id}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none transition-colors 
                ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:text-white"
                }
              `}
            >
              {goal.goal_name || `Cíl #${goal.id}`}
            </button>
          );
        })}
      </div>

      {/* Vybraný cíl */}
      <div className="text-white text-lg font-bold mb-2">
        {localGoals[activeTab].goal_name}
      </div>

      {/* Tělo aktivní záložky (editační formulář) */}
      <div className="bg-gray-700 rounded-b-lg p-4">
        <GoalEdit
          goalId={localGoals[activeTab].id}
          onGoalUpdated={(updatedGoal) => {
            // Aktualizuj lokální list cílů
            setLocalGoals((prev) => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
            // Propaguj do rodiče
            if (onGoalUpdated) {
              onGoalUpdated(updatedGoal);
            }
          }}
          onClose={() => {
            console.log("GoalEdit closed");
          }}
        />
      </div>
    </div>
  );
}
