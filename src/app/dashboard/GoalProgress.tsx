"use client";

import React from "react";

interface GoalProgressProps {
  overallProgress: number;
  dayStreak: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ overallProgress, dayStreak }) => {
  // Výpočet obvodu kruhu pro SVG
  const circumference = 2 * Math.PI * 45; // r=45%
  const progressOffset = circumference - (circumference * overallProgress) / 100;

  // Výpočet progress pro streak (70% je cíl pro 8 dní)
  const streakProgress = Math.min((dayStreak / 8) * 100, 100);

  return (
    <div className="flex gap-4 justify-center w-full">
      {/* Karta - Goals */}
      <div className="bg-gray-800 rounded-lg p-4 w-1/2 text-center">
        <h2 className="text-lg font-semibold text-white">Goals</h2>
        {/* Kruh s celkovým pokrokem */}
        <div className="relative flex items-center justify-center mt-4">
          <svg className="w-24 h-24">
            {/* Pozadí kruhu */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              strokeWidth="10"
              fill="none"
              stroke="currentColor"
              className="text-gray-600"
            />
            {/* Progress kruh */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              strokeWidth="10"
              fill="none"
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              className="text-purple-500 transition-all duration-500"
            />
          </svg>
          <span className="absolute text-2xl font-bold text-white">
            {Math.round(overallProgress)}%
          </span>
        </div>
      </div>

      {/* Karta - Day Streaks */}
      <div className="bg-gray-800 rounded-lg p-4 w-1/2 text-center">
        <h2 className="text-lg font-semibold text-white">Day Streaks</h2>
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full transition-all duration-300 ${
                index < dayStreak 
                  ? "bg-green-400 shadow-lg shadow-green-400/30" 
                  : "bg-gray-600"
              }`}
            ></div>
          ))}
        </div>
        {/* Procentuální progress pro streak */}
        <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${streakProgress}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xl font-bold text-white">
          {dayStreak}{" "}
          {dayStreak === 1
            ? "den v řadě"
            : dayStreak >= 2 && dayStreak <= 4
            ? "dny v řadě"
            : "dní v řadě"}
        </div>

        <button className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors duration-300">
          Keep it up!
        </button>
      </div>
    </div>
  );
};

export default GoalProgress; 