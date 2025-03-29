"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import GoalEdit from "../../../components/Goal/GoalEdit/GoalEdit";
import TabbedGoals from "../../../components/Goal/TabbedGoals";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClock, faGraduationCap, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

// Typ cíle
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

// Typ uživatele
interface UserData {
  username: string;
  email: string;
  fullname: string;
  address: string;
}

// Typ kurzu
interface Lesson {
  id: number;
  title: string;
  duration: number;
}

interface Course {
  id: number;
  name: string;
  description: string;
  image?: string;
  lessons: Lesson[];
}

interface UserCourse {
  id: number;
  progress: number;
  completedAt: string | null;
  course: Course;
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

  // Stav pro kurzy
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);

  // Stav pro načítání a zprávy
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
        // Paralelní načtení profilu, cílů a kurzů
        const [resUser, resGoals, resCourses] = await Promise.all([
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
          fetch("http://localhost:3001/api/courses/my/courses", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!resUser.ok || !resGoals.ok || !resCourses.ok) {
          throw new Error("Nepodařilo se načíst profil, cíle nebo kurzy.");
        }

        const [dataUser, dataGoals, dataCourses] = await Promise.all([
          resUser.json(),
          resGoals.json(),
          resCourses.json(),
        ]);

        setUserData({
          username: dataUser.username || "",
          email: dataUser.email || "",
          fullname: dataUser.fullname || "",
          address: dataUser.address || "",
        });

        setGoals(dataGoals);
        setUserCourses(dataCourses);
      } catch (err: any) {
        setMessage(err.message);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Uložení změn profilu
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

  // Změna vstupních polí
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Odhlášení uživatele
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  // Funkce pro odhlášení z kurzu
  const handleUnenrollFromCourse = async (courseId: number) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3001/api/courses/${courseId}/unenroll`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Nepodařilo se odhlásit z kurzu.");
      }

      // Aktualizovat seznam kurzů po odhlášení
      setUserCourses(userCourses.filter(uc => uc.course.id !== courseId));
      setMessage("Byli jste úspěšně odhlášeni z kurzu.");
      setMessageType("success");
    } catch (err: any) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  // Funkce pro pokračování v kurzu
  const handleContinueCourse = (courseId: number) => {
    router.push(`/courses/${courseId}`);
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
      {/* Hlavička s názvem a tlačítkem pro odhlášení */}
      <div className="w-full max-w-xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard / Profil</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Odhlásit se
        </button>
      </div>

      {/* Formulář pro úpravu profilu */}
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

      {/* Seznam kurzů uživatele */}
      <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-xl p-6 mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Vaše kurzy</h2>
        
        {userCourses.length === 0 ? (
          <p className="text-gray-400">Nemáte zapsané žádné kurzy.</p>
        ) : (
          <div className="space-y-4">
            {userCourses.map((userCourse) => (
              <div key={userCourse.id} className={`bg-gray-700 rounded-lg p-4 ${userCourse.completedAt ? 'opacity-70' : ''}`}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-white">{userCourse.course.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{userCourse.course.description}</p>
                    <div className="flex items-center text-sm text-gray-400 mt-2">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {userCourse.course.lessons.reduce((total, lesson) => total + lesson.duration, 0)} minut
                      <span className="ml-4">{userCourse.progress}% dokončeno</span>
                      {userCourse.completedAt && (
                        <span className="ml-4 text-green-400 flex items-center">
                          <FontAwesomeIcon icon={faCheck} className="mr-1" /> Dokončeno
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {!userCourse.completedAt && (
                      <button 
                        onClick={() => handleContinueCourse(userCourse.course.id)}
                        className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                      >
                        Pokračovat
                      </button>
                    )}
                    <button 
                      onClick={() => handleUnenrollFromCourse(userCourse.course.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Odhlásit
                    </button>
                  </div>
                </div>
                {!userCourse.completedAt && (
                  <div className="w-full bg-gray-800 rounded-full h-1 mt-3">
                    <div
                      className="bg-purple-500 h-1 rounded-full"
                      style={{ width: `${userCourse.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seznam cílů + možnost editace */}
      <div className="min-h-screen w-full mt-8">
        <TabbedGoals goals={goals} />
      </div>
    </div>
  );
}
