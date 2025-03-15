"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Definice rozhraní pro jeden cíl
interface Goal {
  id: number;
  goal_name: string;
  reason: string;
  destination: string;
  new_self: string;
  daily_action: string;
  daily_learning: string;
  daily_visualization: string;
  duration: number;
}

// Definice rozhraní pro úkol
interface Task {
  id: number;
  name: string;
  completed: boolean;
}

// Komponenta, která se stará o úkoly (tasks) pro jeden konkrétní cíl
const GoalTasks: React.FC<{ goal: Goal }> = ({ goal }) => {
  // Vytvoříme úkoly s předdefinovanými hodnotami
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: goal.daily_action, completed: false },
    { id: 2, name: goal.daily_learning, completed: false },
    { id: 3, name: goal.daily_visualization, completed: false },
  ]);

  // Výpočet pokroku
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const isCompleted = progress === 100;

  // Funkce pro změnu stavu úkolu
  const toggleTaskCompletion = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div key={goal.id} className="mt-6 text-left">
      <h3 className="text-white font-medium">{goal.goal_name}</h3>

      {/* Úkoly s moderním custom checkboxem a individuálními emoji */}
      <div className="mt-4">
        {tasks.map((task) => {
          // Definice emoji pro jednotlivé typy úkolů:
          const emojiMap = {
            1: { completed: "✅", notCompleted: "💪🏼" },
            2: { completed: "✅", notCompleted: "📚" },
            3: { completed: "✅", notCompleted: "🧘‍♂️" },
          };

            const emoji = task.completed
            ? emojiMap[task.id as keyof typeof emojiMap].completed
            : emojiMap[task.id as keyof typeof emojiMap].notCompleted;

          return (
            <div key={task.id} className="flex items-center mt-2">
              <label className="inline-flex items-center cursor-pointer">
                {/* Skrytý nativní checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="sr-only peer"
                />
                {/* Vlastní vizuální checkbox */}
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
              {/* Text úkolu s odsaděním a individuálním emoji */}
              <span className="ml-3 text-lg select-none transition-all duration-300 ease-in-out">
                {emoji} {task.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar - Celkový postup */}
      <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isCompleted ? "bg-green-500" : "bg-purple-500"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      // Ověření tokenu
      const token = Cookies.get("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/api/goals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }

        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (goals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
            Nemáte žádné cíle
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Vytvořte si svůj první cíl a začněte svou cestu k úspěchu.
          </p>
          <button
            onClick={() => router.push("/GoalFormPage")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
          >
            Vytvořit cíl
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen text-white font-sans mb-20 md:mt-20">
      <div className="w-full max-w-4xl mx-auto p-2">
        <div className="grid grid-cols-2 items-center">
          {/* Levá část s logem */}
          <div className="flex items-center bg-white text-black rounded-full p-1 px-3 justify-self-start">
            <img
              src="/images/app-image/marenas-logo-octo.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-full mr-2"
            />
            <h1 className="text-xl font-bold">EVO</h1>
          </div>

          {/* Pravá část s uživatelem */}
          <div className="flex items-center justify-self-end">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-black font-bold">U</span>
            </div>
          </div>
        </div>

        <section className="bg-white text-black p-4 rounded-lg w-full text-center my-4">
          <p className="text-2xl italic px-2">
            “Dosáhněte vašeho cíle rychleji a úspěšněji.”
          </p>
          <p className="mt-2 text-sm">Krotil Matyáš</p>
        </section>

        <div className="flex flex-col items-center space-y-4 my-4 w-full">
          {/* Wrapper s kartami */}
          <div className="flex gap-4 justify-center w-full">
            {/* Karta - Goals */}
            <div className="bg-gray-800 rounded-lg p-4 w-1/2 text-center">
              <h2 className="text-lg font-semibold">Goals</h2>
              <div className="relative flex items-center justify-center mt-4">
                <svg className="w-24 h-24">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    strokeWidth="10"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-600"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    strokeWidth="10"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * 50) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 47.5 48)"
                    className="text-purple-500"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-white">
                  50 %
                </span>
              </div>
            </div>

            {/* Karta - Day Streaks */}
            <div className="bg-gray-800 rounded-lg p-4 w-1/2 text-center">
              <h2 className="text-lg font-semibold">Day Streaks</h2>
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full ${
                      index < 4 ? "bg-green-400" : "bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded">
                Keep it up!
              </button>
            </div>
          </div>

          {/* Přehled cílů */}
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

          {/* Modules in Progress */}
          <section className="ActualStudyModel w-full">
            <div className="bg-gray-800 rounded-lg p-4 w-full text-center">
              <h2 className="text-lg font-semibold border-b border-gray-600 pb-2">
                Modules in Progress
              </h2>
              {/* Module Title */}
              <p className="font-medium mt-2">Meditation for Success</p>
              <p className="text-sm text-gray-400">Lekce 2: Concentration</p>
              {/* Motivational Quotes */}
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <div className="flex text-center pb-1">
                  <h3 className="ml-3">#2 Concentration</h3>
                  <div className="pl-2 text-center flex justify-end ml-auto mr-3">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-gray-400 w-[22px]"
                    />
                    <h3 className="px-1">8 min</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  začátek psaní, pro lekci kterou si každý vyzkouší atd...
                </p>
              </div>
              {/* Action Button */}
              <Link
                href="/educationPage"
                className="mt-5 px-4 py-2 bg-purple-500 text-white rounded block text-center"
              >
                Start Learning
              </Link>
              {/* Progress Bar */}
              <div className="w-full bg-gray-600 rounded-full h-2 mt-5">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-1">50% Completed</p>
              {/* Upcoming Module */}
              <div className="mt-5 p-3 bg-gray-700 rounded-lg text-center">
                <h3 className="font-semibold text-sm text-white">
                  Upcoming Module:
                </h3>
                <p className="text-xs text-gray-400">
                  Mindfulness for Productivity
                </p>
              </div>
            </div>
          </section>

          {/* ✅ Dnešní úkoly */}
          <div className="bg-gray-800 rounded-lg p-6 w-full text-center">
            <h2 className="text-lg font-semibold border-b border-gray-600 pb-2">
              📌 Dnešní úkoly
            </h2>
            <div className="mt-4">
              {goals.map((goal) => (
                <GoalTasks key={goal.id} goal={goal} />
              ))}
            </div>
            <button className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg hover:scale-105 transition-transform">
              ✅ Dokončit úkoly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
