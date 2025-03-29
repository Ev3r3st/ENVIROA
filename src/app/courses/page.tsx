"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
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

const CoursesPage: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        // Načtení všech kurzů
        const allCoursesRes = await fetch('http://localhost:3001/api/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Načtení kurzů uživatele
        const myCoursesRes = await fetch('http://localhost:3001/api/courses/my/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!allCoursesRes.ok || !myCoursesRes.ok) {
          throw new Error('Nepodařilo se načíst kurzy');
        }

        const [allCoursesData, myCoursesData] = await Promise.all([
          allCoursesRes.json(),
          myCoursesRes.json(),
        ]);

        setCourses(allCoursesData);
        setEnrolledCourses(myCoursesData);
      } catch (error) {
        console.error('Chyba při načítání kurzů:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const enrollToCourse = async (courseId: number) => {
    const token = Cookies.get('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Nepodařilo se zapsat do kurzu');
      }

      // Odpověď není využita, ale zpracujeme ji pro ujištění, že požadavek proběhl úspěšně
      await res.json();
      
      // Přesměrovat na dashboard
      router.push(`/dashboard?courseId=${courseId}`);
    } catch (error) {
      console.error('Chyba při zápisu do kurzu:', error);
    }
  };

  const continueCourse = (courseId: number) => {
    router.push(`/courses/${courseId}`);
  };

  // Filtrovat dostupné kurzy (ty, ve kterých uživatel není zapsán nebo je dokončil)
  const availableCourses = courses.filter(
    (course) => 
      !enrolledCourses.some(
        (userCourse) => 
          userCourse.course.id === course.id && !userCourse.completedAt
      )
  );

  // Filtrovat aktivní kurzy (ty, ve kterých je uživatel zapsán, ale nedokončil je)
  const activeCourses = enrolledCourses.filter(
    (userCourse) => !userCourse.completedAt
  );
  
  // Filtrovat dokončené kurzy
  const completedCourses = enrolledCourses.filter(
    (userCourse) => userCourse.completedAt !== null
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Načítání kurzů...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vzdělávací kurzy</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Zpět na Dashboard
          </button>
        </div>

        {/* Aktivní kurzy */}
        {activeCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Vaše aktivní kurzy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((userCourse) => (
                <div
                  key={userCourse.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => continueCourse(userCourse.course.id)}
                >
                  {userCourse.course.image && (
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${userCourse.course.image})` }}
                    />
                  )}
                  {!userCourse.course.image && (
                    <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-6xl opacity-50" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{userCourse.course.name}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {userCourse.course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        {userCourse.course.lessons.reduce(
                          (total, lesson) => total + lesson.duration,
                          0
                        )}{' '}
                        minut
                      </div>
                      <div className="text-purple-400 text-sm font-medium">
                        {userCourse.progress}% dokončeno
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-3">
                      <div
                        className="bg-purple-500 h-1 rounded-full"
                        style={{ width: `${userCourse.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dokončené kurzy */}
        {completedCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Dokončené kurzy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((userCourse) => (
                <div
                  key={userCourse.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 opacity-70"
                >
                  {userCourse.course.image && (
                    <div
                      className="h-48 bg-cover bg-center grayscale"
                      style={{ backgroundImage: `url(${userCourse.course.image})` }}
                    />
                  )}
                  {!userCourse.course.image && (
                    <div className="h-48 bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-6xl opacity-50" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold mb-2">{userCourse.course.name}</h3>
                      <span className="bg-green-800 text-green-100 px-2 py-1 rounded-full text-xs">Dokončeno</span>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {userCourse.course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        {userCourse.course.lessons.reduce(
                          (total, lesson) => total + lesson.duration,
                          0
                        )}{' '}
                        minut
                      </div>
                      <button
                        onClick={() => router.push(`/courses/${userCourse.course.id}`)}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        Zobrazit kurz
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dostupné kurzy */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Dostupné kurzy</h2>
          {availableCourses.length === 0 ? (
            <p className="text-gray-400">Momentálně nejsou k dispozici žádné nové kurzy.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {course.image && (
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${course.image})` }}
                    />
                  )}
                  {!course.image && (
                    <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-6xl opacity-50" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        {course.lessons.reduce((total, lesson) => total + lesson.duration, 0)}{' '}
                        minut
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          enrollToCourse(course.id);
                        }}
                        className="flex items-center text-sm font-medium bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors"
                      >
                        Zapsat se
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage; 