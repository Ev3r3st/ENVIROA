"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    fullname: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Nepodařilo se načíst profil.");
        }

        const data = await res.json();
        setUserData({
          username: data.username || "",
          email: data.email || "",
          fullname: data.fullname || "",
          address: data.address || "",
        });
      } catch (err: any) {
        setMessage(err.message);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      const res = await fetch("http://localhost:3001/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>Načítání...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8 px-4">
      {/* Horní nadpis nebo hero sekce, pokud chceš */}
      <h1 className="text-3xl font-bold text-white mb-6">
        Upravit profil
      </h1>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Uživatelské jméno */}
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
              className="w-full bg-gray-700 text-white rounded border border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
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
              className="w-full bg-gray-700 text-white rounded border border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Celé jméno */}
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
              className="w-full bg-gray-700 text-white rounded border border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Adresa */}
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
              className="w-full bg-gray-700 text-white rounded border border-gray-600 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tlačítko pro uložení */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            Uložit změny
          </button>
        </form>
      </div>
    </div>
  );
}
