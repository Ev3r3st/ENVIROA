/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosInstance from '@/services/axios';


interface Goal {
  id: number;
  goal_name: string;
  reason?: string;
  destination?: string;
  new_self?: string;
  daily_action?: string;
  daily_learning?: string;
  daily_visualization?: string;
  duration?: number;
}


interface GoalEditProps {
  goalId: number; 
  onGoalUpdated?: (updatedGoal: Goal) => void; 
  onClose?: () => void; 
}

export default function GoalEdit({ goalId, onGoalUpdated, onClose }: GoalEditProps) {
  const [goalData, setGoalData] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // 1) Načteme detail cíle
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setMessage("Chybí token, nelze načíst cíl.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const fetchGoal = async () => {
      try {
        const response = await axiosInstance.get<Goal>(`/goals/${goalId}`);
        setGoalData(response.data);
      } catch (error: any) {
        const msg = error.response?.data?.message || error.message || 'Nepodařilo se načíst vybraný cíl.';
        setMessage(msg);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [goalId]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!goalData) return;
    setGoalData({ ...goalData, [e.target.name]: e.target.value });
  };

  // 2) Uložit změny (PUT /goals/:goalId)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalData) return;

    const token = Cookies.get("token");
    if (!token) {
      setMessage("Chybí token, nelze uložit změny.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axiosInstance.put<Goal>(`/goals/${goalId}`, goalData);
      const updatedGoal = response.data;
      setGoalData(updatedGoal);
      setMessage("Cíl byl úspěšně upraven.");
      setMessageType("success");
      if (onGoalUpdated) onGoalUpdated(updatedGoal);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Nepodařilo se upravit cíl.';
      setMessage(msg);
      setMessageType("error");
    }
  };

  if (loading) {
    return <div className="text-white">Načítání cíle...</div>;
  }

  if (!goalData) {
    return <div className="text-red-400">Cíl nenalezen.</div>;
  }

  return (
    <div className="bg-gray-800 shadow-md rounded p-4 w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-white mb-4">Upravit cíl</h2>

      {message && (
        <div
          className={`mb-4 p-2 rounded text-center ${
            messageType === "success"
              ? "bg-green-100 border border-green-300 text-green-800"
              : "bg-red-100 border border-red-300 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Název cíle */}
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-1">
            Název cíle:
          </label>
          <input
            type="text"
            name="goal_name"
            value={goalData.goal_name}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded border border-gray-600 py-1 px-2"
          />
        </div>

        {/* Důvod */}
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-1">
            Důvod:
          </label>
          <textarea
            name="reason"
            value={goalData.reason || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded border border-gray-600 py-1 px-2"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-1">
            Cílové umístění:
          </label>
          <input
            type="text"
            name="destination"
            value={goalData.destination || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded border border-gray-600 py-1 px-2"
          />
        </div>

        {/* Nové já */}
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-1">
            Nové já:
          </label>
          <input
            type="text"
            name="new_self"
            value={goalData.new_self || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded border border-gray-600 py-1 px-2"
          />
        </div>

        {/* Denní akce */}
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-1">
            Denní akce:
          </label>
          <input
            type="text"
            name="daily_action"
            value={goalData.daily_action || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded border border-gray-600 py-1 px-2"
          />
        </div>

        {/* Denní učení */}
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-1">
            Denní učení:
          </label>
          <input
            type="text"
            name="daily_learning"
            value={goalData.daily_learning || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded border border-gray-600 py-1 px-2"
          />
        </div>

        {/* Denní vizualizace */}
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-1">
            Denní vizualizace:
          </label>
          <input
            type="text"
            name="daily_visualization"
            value={goalData.daily_visualization || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded border border-gray-600 py-1 px-2"
          />
        </div>

        {/* Délka trvání */}
        <div>
          <label className="block text-gray-200 text-sm font-bold mb-1">
            Délka trvání (dny):
          </label>
          <input
            type="number"
            name="duration"
            value={goalData.duration || 0}
            onChange={(e) =>
              setGoalData({
                ...goalData,
                duration: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full bg-gray-700 text-white rounded border border-gray-600 py-1 px-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
          >
            Uložit změny
          </button>
          {onClose && (
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded"
              onClick={onClose}
            >
              Zavřít
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
