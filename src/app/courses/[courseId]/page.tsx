"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  duration: number;
  order: number;
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

interface CompletedLesson {
  id: number;
  lessonId: number;
  completedAt: string;
}

const CoursePage = ({ params }: { params: { courseId: string } }) => {
  const router = useRouter();
  const courseId = parseInt(params.courseId);

  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Komponenta kurzu se načítá, courseId:", courseId);
    fetchUserCourseData();
  }, [courseId]);

  const fetchUserCourseData = async () => {
    try {
      console.log("Začínám načítat data kurzu");
      const token = Cookies.get('token');
      if (!token) {
        console.error("Token není k dispozici");
        router.replace('/login');
        return;
      }

      console.log("Volám API endpoint:", `http://localhost:3001/api/courses/${courseId}/progress`);
      // Načtení detailu kurzu s progress uživatele
      const courseProgressRes = await fetch(`http://localhost:3001/api/courses/${courseId}/progress`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("API odpověď status:", courseProgressRes.status);
      
      if (!courseProgressRes.ok) {
        const errorText = await courseProgressRes.text();
        console.error("Chyba API odpovědi:", errorText);
        setError(`API chyba: ${courseProgressRes.status} - ${errorText}`);
        throw new Error(`Nepodařilo se načíst data kurzu: ${courseProgressRes.status} - ${errorText}`);
      }
      
      const courseProgressData = await courseProgressRes.json();
      console.log("Přijatá data z API:", JSON.stringify(courseProgressData, null, 2));
      
      // Kontrola struktury dat
      if (!courseProgressData.userCourse) {
        console.error("Chybí userCourse v odpovědi API");
        setError("Neplatný formát dat: chybí userCourse");
        throw new Error("Neplatný formát dat: chybí userCourse");
      }
      
      if (!Array.isArray(courseProgressData.completedLessons)) {
        console.error("completedLessons není pole nebo chybí v odpovědi API");
        setError("Neplatný formát dat: completedLessons není pole nebo chybí");
        throw new Error("Neplatný formát dat: completedLessons není pole nebo chybí");
      }
      
      setUserCourse(courseProgressData.userCourse);
      setCompletedLessons(courseProgressData.completedLessons.map((cl: CompletedLesson) => cl.lessonId));
      
      // Najít první nedokončenou lekci a nastavit ji jako aktuální
      if (courseProgressData.completedLessons.length > 0 && 
          courseProgressData.userCourse.course.lessons && 
          courseProgressData.userCourse.course.lessons.length > 0) {
        
        const completedLessonIds = courseProgressData.completedLessons.map((cl: CompletedLesson) => cl.lessonId);
        
        // Najdi první lekci, která není v seznamu dokončených
        const firstUncompletedLessonIndex = courseProgressData.userCourse.course.lessons.findIndex(
          (lesson: Lesson) => !completedLessonIds.includes(lesson.id)
        );
        
        console.log("První nedokončená lekce na indexu:", firstUncompletedLessonIndex);
        
        // Pokud jsou všechny lekce dokončené, zobraz poslední, jinak první nedokončenou
        setCurrentLessonIndex(firstUncompletedLessonIndex === -1 
          ? courseProgressData.userCourse.course.lessons.length - 1
          : firstUncompletedLessonIndex
        );
      } else {
        console.log("Žádné dokončené lekce nebo kurz nemá lekce");
      }
    } catch (error) {
      console.error('Chyba při načítání dat kurzu:', error);
      setError(`Chyba při načítání: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    } finally {
      console.log("Dokončeno načítání, nastavuji loading=false");
      setLoading(false);
    }
  };

  const markLessonAsCompleted = async (lessonId: number) => {
    if (!userCourse) return;
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      
      const res = await fetch(`http://localhost:3001/api/courses/${courseId}/lesson/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Nepodařilo se označit lekci jako dokončenou');
      }
      
      const result = await res.json();
      
      // Aktualizovat seznam dokončených lekcí
      setCompletedLessons(prev => [...prev, lessonId]);
      
      // Aktualizovat celkový progress v kurzu
      if (userCourse) {
        setUserCourse({
          ...userCourse,
          progress: result.progress
        });
      }
    } catch (error) {
      console.error('Chyba při označování lekce jako dokončené:', error);
    }
  };

  const markCourseAsCompleted = async () => {
    if (!userCourse) return;
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      
      const res = await fetch(`http://localhost:3001/api/courses/${courseId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Nepodařilo se dokončit kurz');
      }
      
      // Přesměrování na stránku s kurzy po dokončení
      router.push('/courses');
    } catch (error) {
      console.error('Chyba při dokončování kurzu:', error);
    }
  };

  const goToNextLesson = () => {
    if (!userCourse || currentLessonIndex >= userCourse.course.lessons.length - 1) return;
    setCurrentLessonIndex(currentLessonIndex + 1);
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex <= 0) return;
    setCurrentLessonIndex(currentLessonIndex - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Načítání kurzu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-xl mb-4">Chyba při načítání kurzu</div>
        <div className="text-red-400 text-sm">{error}</div>
        <button 
          onClick={() => router.push('/courses')}
          className="mt-6 px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Zpět na seznam kurzů
        </button>
      </div>
    );
  }

  if (!userCourse || !userCourse.course || !userCourse.course.lessons || userCourse.course.lessons.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-xl mb-4">Kurz nemá žádné lekce nebo nebyl nalezen</div>
        <button 
          onClick={() => router.push('/courses')}
          className="mt-6 px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Zpět na seznam kurzů
        </button>
      </div>
    );
  }

  const { course } = userCourse;
  const currentLesson = course.lessons[currentLessonIndex];
  const isLessonCompleted = completedLessons.includes(currentLesson.id);
  const allLessonsCompleted = course.lessons.every(lesson => completedLessons.includes(lesson.id));
  const isLastLesson = currentLessonIndex === course.lessons.length - 1;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hlavička kurzu */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-gray-400 mt-2">{course.description}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Zpět na Dashboard
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Celkový pokrok</span>
            <span>{userCourse.progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${userCourse.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seznam lekcí */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Lekce</h2>
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    currentLessonIndex === index
                      ? 'bg-purple-500'
                      : isCompleted
                      ? 'bg-gray-700'
                      : 'bg-gray-800'
                  } hover:bg-purple-600`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-400">Lekce {index + 1}</span>
                      <h3 className="font-medium">{lesson.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        <FontAwesomeIcon icon={faClock} className="mr-1" />
                        {lesson.duration} min
                      </span>
                      {isCompleted && (
                        <FontAwesomeIcon icon={faCheck} className="text-green-400" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Obsah lekce */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-2">{currentLesson.title}</h2>
              {currentLesson.subtitle && (
                <p className="text-gray-400 mb-4">{currentLesson.subtitle}</p>
              )}
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{currentLesson.content}</div>
              </div>
              
              {/* Dokončení lekce */}
              <div className="mt-8 border-t border-gray-700 pt-6">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => markLessonAsCompleted(currentLesson.id)}
                    disabled={isLessonCompleted}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLessonCompleted
                        ? 'bg-green-600 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isLessonCompleted ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} /> Lekce dokončena
                      </>
                    ) : (
                      <>
                        Označit jako dokončené
                      </>
                    )}
                  </button>
                </div>
                
                {/* Navigační tlačítka */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={goToPreviousLesson}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      currentLessonIndex === 0
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-purple-500 hover:bg-purple-600'
                    } transition-colors`}
                    disabled={currentLessonIndex === 0}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Předchozí lekce
                  </button>
                  
                  {isLastLesson && allLessonsCompleted ? (
                    <button
                      onClick={markCourseAsCompleted}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                    >
                      Dokončit kurz <FontAwesomeIcon icon={faCheck} />
                    </button>
                  ) : (
                    <button
                      onClick={goToNextLesson}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        currentLessonIndex === course.lessons.length - 1
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-purple-500 hover:bg-purple-600'
                      } transition-colors`}
                      disabled={currentLessonIndex === course.lessons.length - 1}
                    >
                      Další lekce <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage; 