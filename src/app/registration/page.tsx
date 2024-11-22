"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Use next/navigation for routing

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState(""); // Nové pole pro celé jméno
  const [address, setAddress] = useState(""); // Nové pole pro adresu
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Odeslání všech dat
      const response = await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
        email,
        fullName, // Posíláme celé jméno
        address, // Posíláme adresu
      });

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        router.push("/dashboard"); // Přesměrování na dashboard po úspěšné registraci
      }
    } catch (err) {
      setError("Chyba při registraci. Zkuste to znovu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4 text-center">Registrace</h2>
      <form onSubmit={handleRegister} className="space-y-4">
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
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">
            Celé jméno
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium">
            Adresa
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
          {loading ? "Registruji..." : "Registrovat se"}
        </button>
      </form>
    </div>
  );
};

export default Register;
