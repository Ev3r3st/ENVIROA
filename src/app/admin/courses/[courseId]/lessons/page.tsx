"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  duration: number;
  order?: number;
}

interface Course {
  id: number;
  name: string;
  description: string;
  lessons: Lesson[];
}

const CourseLessonsPage = ({ params }: { params: { courseId: string } }) => {
  const router = useRouter();
  const courseId = parseInt(params.courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    subtitle: '',
    content: '',
    duration: 0
  });
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  // 1) Načtení detailu kurzu
  // ---------------------------------------------------
  const fetchCourse = async () => {
    try {
      const token = Cookies.get("token");
      console.log("fetchCourse -> JWT Token:", token);

      if (!token) {
        console.error("fetchCourse -> Nebyl nalezen token v cookies!");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`fetchCourse: Server returned ${response.status}`);
      }

      const data = await response.json();
      setCourse(data);
      console.log("fetchCourse -> Kurz načten:", data);

    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // 2) Vytvoření lekce v daném kurzu
  // ---------------------------------------------------
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      console.log("handleCreateLesson -> JWT Token:", token);

      if (!token) {
        console.error("handleCreateLesson -> Nebyl nalezen token v cookies!");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newLesson)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("handleCreateLesson -> Chyba při vytváření lekce:", errorData);
        throw new Error("Failed to create lesson");
      }

      console.log("handleCreateLesson -> Lekce vytvořena úspěšně!");
      setNewLesson({ title: '', subtitle: '', content: '', duration: 0 });
      fetchCourse();  

    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  // ---------------------------------------------------
  // 3) Funkce pro změnu pořadí lekce
  // ---------------------------------------------------
  const handleMoveLesson = async (lessonId: number, direction: 'up' | 'down') => {
    if (!course) return;
    
    
    const lessons = [...course.lessons];
    const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === lessons.length - 1) return;
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const temp = lessons[newIndex];
    lessons[newIndex] = lessons[currentIndex];
    lessons[currentIndex] = temp;
    
    setCourse({ ...course, lessons });
    
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token nebyl nalezen v cookies!");
        return;
      }
      
      // Volání API pro trvalou změnu pořadí
      const response = await fetch(
        `http://localhost:3001/api/courses/lesson/${lessonId}/order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ direction }),
        }
      );
      
      if (!response.ok) {
        console.error(`Chyba při změně pořadí lekce: ${response.status}`);
        fetchCourse(); 
        return;
      }
      
      console.log(`Pořadí lekce ${lessonId} úspěšně změněno ${direction === 'up' ? 'nahoru' : 'dolů'}`);
      
      
      fetchCourse();
      
    } catch (error) {
      console.error('Error updating lesson order:', error);
      
      fetchCourse();
    }
  };

 
  useEffect(() => {
    fetchCourse();
   
  }, [courseId]);

  
  if (loading || !course) {
    return <div className="flex justify-center items-center h-screen">Načítání...</div>;
  }

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Hlavička kurzu */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-gray-400 mt-2">Správa lekcí</p>
          </div>
          <button
            onClick={() => router.push('/admin/courses')}
            className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Zpět na kurzy
          </button>
        </div>

        {/* Formulář pro vytvoření lekce */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Přidat novou lekci</h2>
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <div>
              <label className="block mb-2">Název lekce</label>
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Podtitul</label>
              <input
                type="text"
                value={newLesson.subtitle}
                onChange={(e) => setNewLesson({ ...newLesson, subtitle: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2">Obsah</label>
              <textarea
                value={newLesson.content}
                onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded-lg"
                rows={8}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Délka (v minutách)</label>
              <input
                type="number"
                value={newLesson.duration}
                onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) })}
                className="w-full p-2 bg-gray-700 rounded-lg"
                min="1"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Přidat lekci
            </button>
          </form>
        </div>

        {/* Seznam lekcí */}
        <div className="space-y-4">
          {course.lessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {/* Tlačítka pro změnu pořadí */}
                  <div className="flex flex-col mr-4">
                    <button 
                      onClick={() => handleMoveLesson(lesson.id, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 bg-gray-600 rounded-t-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveLesson(lesson.id, 'down')}
                      disabled={index === course.lessons.length - 1}
                      className="px-2 py-1 bg-gray-600 rounded-b-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold">
                      Lekce {index + 1}: {lesson.title}
                    </h3>
                    {lesson.subtitle && (
                      <p className="text-gray-400 mt-1">{lesson.subtitle}</p>
                    )}
                    <p className="text-sm text-purple-400 mt-2">
                      Délka: {lesson.duration} minut
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/admin/courses/${courseId}/lessons/${lesson.id}`)}
                  className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Upravit
                </button>
              </div>
              <div className="mt-4">
                <p className="text-gray-300 whitespace-pre-wrap">{lesson.content}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CourseLessonsPage;
