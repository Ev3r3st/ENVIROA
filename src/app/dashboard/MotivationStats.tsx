"use client";

import React from "react";

interface MotivationStatsProps {
  totalCompletedDays: number;
  overallProgress: number;
}

const MotivationStats: React.FC<MotivationStatsProps> = ({
  totalCompletedDays,
  overallProgress,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full text-center my-6">
      <h2 className="text-lg font-semibold">Motivace a statistika</h2>
      <p className="text-gray-400 mt-2">
        &quot;Každý den je novou příležitostí k dosažení vašich cílů!&quot;
      </p>
      <div className="mt-4">
        <h3 className="text-md font-medium">Statistika denních aktivit</h3>
        <div className="flex justify-between mt-2">
          <div>
            <span className="text-lg font-bold">{totalCompletedDays}</span>
            <span className="text-gray-400"> splněných dnů</span>
          </div>
          <div>
            <span className="text-lg font-bold">
              {overallProgress.toFixed(0)}%
            </span>
            <span className="text-gray-400"> celkový pokrok</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationStats; 