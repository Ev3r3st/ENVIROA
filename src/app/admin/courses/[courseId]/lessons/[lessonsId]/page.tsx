// app/admin/courses/[courseId]/lessons/[lessonId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from '@/services/axios';

// Rozhraní pro Lesson
interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  duration: number;
}

export default function EditLessonPage({
  params,
}: {
  params: { courseId: string; lessonsId: string };
}) {
  const router = useRouter();

 
  const courseId = parseInt(params.courseId, 10);
  const lessonId = parseInt(params.lessonsId, 10);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState(0);

  // 1) Načtení detailu lekce z API
  const fetchLesson = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token not found in cookies");

      const response = await axiosInstance.get<Lesson>(`/courses/lesson/${lessonId}`);
      setLesson(response.data);

      // Předvyplnit form
      setTitle(response.data.title);
      setSubtitle(response.data.subtitle || "");
      setContent(response.data.content);
      setDuration(response.data.duration);
    } catch (error) {
      console.error("Error fetchLesson:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2) Uložení změn = PUT na /api/courses/lesson/:lessonId
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token not found in cookies");

      await axiosInstance.put(`/courses/lesson/${lessonId}`, { title, subtitle, content, duration });

      console.log("Lesson updated successfully!");
      router.push(`/admin/courses/${courseId}/lessons`);
    } catch (error) {
      console.error("Error handleSave:", error);
    }
  };

  useEffect(() => {
    fetchLesson();
    
  }, [lessonId]);

  // 3) UI stavy
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Načítání...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex justify-center items-center h-screen">
        Lekce nenalezena
      </div>
    );
  }

  // 4) Formulář pro editaci
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Upravit lekci</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block mb-2">Název lekce</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Podtitul</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2">Obsah</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded-lg"
              rows={8}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Délka (v minutách)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full p-2 bg-gray-700 rounded-lg"
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Uložit změny
          </button>
        </form>

        <button
          onClick={() => router.push(`/admin/courses/${courseId}/lessons`)}
          className="mt-4 px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Zpět na seznam lekcí
        </button>
      </div>
    </div>
  );
}
