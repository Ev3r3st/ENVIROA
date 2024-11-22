"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Use next/navigation for navigation

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        router.push("/dashboard"); // Use next/navigation for routing
      }
    } catch (err) {
      setError("Chyba při přihlášení. Zkuste to znovu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4 text-center">Přihlášení</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Uživatelské jméno
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Heslo
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Přihlašuji..." : "Přihlásit se"}
        </button>
      </form>
    </div>
  );
};

export default Login;
