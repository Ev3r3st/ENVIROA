"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import GoalEdit from "../../../components/Goal/GoalEdit/GoalEdit";
import TabbedGoals from "../../../components/Goal/TabbedGoals";

// Typ cíle (pokud chceš detailnější, doplň)
interface Goal {
  id: number;
  goal_name: string;
  reason: string | null;
  destination: string | null;
  new_self: string | null;
  daily_action: string;
  daily_learning: string;
  daily_visualization: string;
  duration: number;
}

interface UserData {
  username: string;
  email: string;
  fullname: string;
  address: string;
}

export default function ProfilePage() {
  const router = useRouter();

  // Stav pro uživatele
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    fullname: "",
    address: "",
  });

  // Stav pro cíle
  const [goals, setGoals] = useState<Goal[]>([]);

  // Stav pro načítání + zprávy
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Paralelní načtení uživatele a cílů
        const [resUser, resGoals] = await Promise.all([
          fetch("http://localhost:3001/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:3001/api/goals", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!resUser.ok || !resGoals.ok) {
          throw new Error("Nepodařilo se načíst profil nebo cíle.");
        }

        const [dataUser, dataGoals] = await Promise.all([
          resUser.json(),
          resGoals.json(),
        ]);

        // dataUser by mělo být něco jako:
        // { username: "..", email: "..", fullname: "..", address: ".." }
        setUserData({
          username: dataUser.username || "",
          email: dataUser.email || "",
          fullname: dataUser.fullname || "",
          address: dataUser.address || "",
        });

        // dataGoals je pole cílů: [ {id:..., goal_name:...}, ...]
        setGoals(dataGoals);
      } catch (err: any) {
        setMessage(err.message);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Uložení změn profilu (PUT /api/users/profile)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          fullname: userData.fullname,
          address: userData.address,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Nepodařilo se uložit změny.");
      }

      setMessage("Profil byl úspěšně uložen.");
      setMessageType("success");
    } catch (err: any) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  // Změna vstupních polí (username, email...)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>Načítání...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8 px-4">
      {/* Profil uživatele */}
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard / Profil</h1>
      <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-xl p-6">
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

        {/* Formulář pro úpravu uživatele */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-1">
              Uživatelské jméno:
            </label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Zadejte uživatelské jméno"
              className="w-full bg-gray-700 text-white rounded border border-gray-600 py-2 px-3"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Zadejte email"
              className="w-full bg-gray-700 text-white rounded border border-gray-600 py-2 px-3"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-1">
              Celé jméno:
            </label>
            <input
              type="text"
              name="fullname"
              value={userData.fullname}
              onChange={handleChange}
              placeholder="Zadejte celé jméno"
              className="w-full bg-gray-700 text-white rounded border border-gray-600 py-2 px-3"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-semibold mb-1">
              Adresa:
            </label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              placeholder="Zadejte adresu"
              className="w-full bg-gray-700 text-white rounded border border-gray-600 py-2 px-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
          >
            Uložit změny
          </button>
        </form>
      </div>

      {/* Seznam cílů + možnost editace */}
      <div className="min-h-screen w-full mt-8">
      
      <TabbedGoals goals={goals} />
    </div>

    </div>
  );
}
