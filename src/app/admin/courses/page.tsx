"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


interface Course {
  id: number;
  name: string;
  description: string;
  image?: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  duration: number;
}

const AdminCoursesPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);


  const fetchCourses = async () => {
    try {
      //  token z cookies
      const token = Cookies.get("token");
      console.log("fetchCourses -> JWT Token:", token);

      if (!token) {
        console.error("fetchCourses -> Nebyl nalezen token v cookies!");
        return;
      }

      const response = await fetch('http://localhost:3001/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`fetchCourses: Server returned ${response.status}`);
      }

      const data = await response.json();
      setCourses(data);
      console.log("fetchCourses -> Kurzy úspěšně načteny:", data);

    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");
      console.log("handleCreateCourse -> JWT Token:", token);

      if (!token) {
        console.error("handleCreateCourse -> Nebyl nalezen token v cookies!");
        return;
      }

      const response = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("handleCreateCourse -> Chyba při vytváření kurzu:", errorData);
        throw new Error("Failed to create course");
      }

      
      console.log("handleCreateCourse -> Kurz vytvořen úspěšně!");
      setNewCourse({ name: '', description: '', image: '' });
      fetchCourses();
      
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };


  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Opravdu chcete smazat tento kurz?')) return;

    try {
      const token = Cookies.get("token");
      console.log("handleDeleteCourse -> JWT Token:", token);

      if (!token) {
        console.error("handleDeleteCourse -> Nebyl nalezen token v cookies!");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("handleDeleteCourse -> Chyba při mazání kurzu:", errorData);
        throw new Error("Failed to delete course");
      }

      console.log(`handleDeleteCourse -> Kurz s ID ${id} úspěšně smazán`);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };


  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Načítání...</div>;
  }

 
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Hlavní hlavička */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Správa kurzů</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Zpět na Dashboard
          </button>
        </div>

        {/* Formulář pro vytvoření kurzu */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Vytvořit nový kurz</h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="block mb-2">Název kurzu</label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Popis</label>
              <textarea
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded-lg"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block mb-2">URL obrázku</label>
              <input
                type="url"
                value={newCourse.image}
                onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Vytvořit kurz
            </button>
          </form>
        </div>
       
        {/* Seznam kurzů */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            
            <div key={course.id} className="bg-gray-800 p-6 rounded-lg">
              {course.image && (
                <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                /></>
              )}
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-gray-400 mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.push(`/admin/courses/${course.id}/lessons`)}
                  className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Spravovat lekce
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Smazat
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminCoursesPage;
