"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Goal, Progress } from "./interfaces";

interface GoalReminderProps {
  goals: Goal[];
  progress: Progress[];
  activeGoalIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

const GoalReminder: React.FC<GoalReminderProps> = ({
  goals,
  progress,
  activeGoalIndex,
  onPrevious,
  onNext,
}) => {
  if (goals.length === 0) return null;

  const activeGoal = goals[activeGoalIndex];
  const activeProgress = progress.find((p) => p.goalId === activeGoal.id);
  const completedDays = activeProgress?.completedDays || 0;
  const remainingDays = activeGoal.duration - completedDays;
  const progressPercent = (completedDays / activeGoal.duration) * 100;

  return (
    <div className="bg-gradient-to-br from-indigo-800 to-purple-700 rounded-lg p-6 w-full text-center my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">
          Připomenutí vašeho cíle
        </h2>

        {/* Indikátor čísla cíle a navigační tlačítka */}
        {goals.length > 1 && (
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">
              Cíl {activeGoalIndex + 1} z {goals.length}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={onPrevious}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white text-sm"
                />
              </button>
              <button
                onClick={onNext}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white text-sm"
                />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Vybraný cíl a jeho detaily */}
        <div className="bg-white bg-opacity-10 rounded-lg p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">
            {activeGoal.goal_name}
          </h3>

          <div className="mt-3 text-gray-200 text-sm">
            <p className="mb-2 italic">&quot;{activeGoal.reason}&quot;</p>
            <p>
              Vaše cílová destinace:{" "}
              <span className="font-medium">{activeGoal.destination}</span>
            </p>
          </div>
        </div>

        {/* Tři pilíře denní rutiny */}
        <div className="overflow-x-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">💪</span>
              </div>
              <h4 className="font-medium text-white">Denní akce</h4>
              <p className="text-gray-200 text-sm mt-2">
                {activeGoal.daily_action}
              </p>
              <p className="text-xs text-gray-300 mt-3 italic">
                Fyzické činnosti, které vás přibližují k vašemu cíli
              </p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📚</span>
              </div>
              <h4 className="font-medium text-white">Denní vzdělávání</h4>
              <p className="text-gray-200 text-sm mt-2">
                {activeGoal.daily_learning}
              </p>
              <p className="text-xs text-gray-300 mt-3 italic">
                Každý den by měl obsahovat vzdělávací prvek
              </p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🧘‍♂️</span>
              </div>
              <h4 className="font-medium text-white">Denní vizualizace</h4>
              <p className="text-gray-200 text-sm mt-2">
                {activeGoal.daily_visualization}
              </p>
              <p className="text-xs text-gray-300 mt-3 italic">
                Vizualizace vám pomůže přiblížit se vašemu budoucímu já
              </p>
            </div>
          </div>
        </div>

        {/* Motivační tip z formuláře */}
        <div className="bg-white bg-opacity-5 rounded-lg p-5 backdrop-blur-sm">
          <h4 className="text-lg font-medium text-white mb-2">
            Denní připomenutí
          </h4>
          <p className="text-gray-200">
            Denní aktivity jsou klíčovým prvkem při přeměně plánů na realitu.
            Pomáhají vám pravidelně pracovat na vašem cíli a udržovat si
            motivaci.
          </p>
          <div className="mt-4 px-5 py-3 bg-white bg-opacity-10 rounded-lg">
            <p className="text-white font-bold text-2xl">
             Tyto 3 aktivity vás dělí od vašeho cíle 
            </p>
          </div>
        </div>

        {/* Vizualizace budoucího "já" */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-5">
          <h4 className="text-lg font-medium text-white mb-2">
            Vaše budoucí já
          </h4>
          <p className="text-gray-200 italic">
            &quot;{activeGoal.new_self}&quot;
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-300">
              Zbývá ještě {remainingDays} dní do dosažení vašeho cíle
            </p>
            <div className="w-full bg-gray-700 bg-opacity-50 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${progressPercent}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalReminder;
