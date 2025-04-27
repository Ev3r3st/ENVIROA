"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from '@/services/axios';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullname: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = isRegistering
        ? "/auth/register"
        : "/auth/login";

      // Pro login posíláme pouze username a password
      const requestData = isRegistering
        ? formData
        : {
            username: formData.username,
            password: formData.password,
          };

      const response = await axiosInstance.post(endpoint, requestData);
      const data = response.data;

      if (isRegistering) {
        toast.success("Registration successful!", {
          position: "top-center",
          autoClose: 3000,
        });
        setIsRegistering(false);
        setFormData({
          username: "",
          password: "",
          email: "",
          fullname: "",
          address: "",
        });
      } else {
        // Přezvětí tokenu - může být buď accessToken nebo access_token podle implementace API
        const token = data.access_token || data.accessToken;
        
        Cookies.set("token", token, {
          expires: 7,
          sameSite: "Strict",
        });

        localStorage.setItem("token", token);

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-6">
        <h2 className="text-center text-2xl font-bold">
          {isRegistering ? "Register" : "Login"}
        </h2>
        {error && (
          <div className="text-red-500 text-center text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
              placeholder="Enter your password"
            />
          </div>
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Address:
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
                  placeholder="Enter your address"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-lg font-semibold"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm text-gray-300"
        >
          {isRegistering ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default LoginPage;
