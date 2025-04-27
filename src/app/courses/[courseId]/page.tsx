"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck, faArrowRight, faArrowLeft, faDownload, faWifi } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { 
  saveCourseOffline, 
  getOfflineCourse, 
  isCourseAvailableOffline, 
  removeCourseOffline,
  isOnline
} from '@/services/offlineStorage';
import axiosInstance from '@/services/axios';

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
  [key: string]: unknown;
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

const OfflineButton = ({ courseId, courseData }: { courseId: string, courseData: Course }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    setIsOffline(isCourseAvailableOffline(courseId));
  }, [courseId]);
  
  const handleToggleOffline = async () => {
    try {
      setSaving(true);
      if (isOffline) {
        removeCourseOffline(courseId);
        setIsOffline(false);
      } else {
        await saveCourseOffline(courseId, courseData);
        setIsOffline(true);
      }
    } catch (error) {
      console.error("Chyba při práci s offline kurzem:", error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <button 
      onClick={handleToggleOffline}
      disabled={saving}
      className={`px-4 py-2 rounded-lg font-medium flex items-center ${
        saving ? 'bg-gray-500 cursor-not-allowed' :
        isOffline 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-green-500 hover:bg-green-600'
      } text-white transition-colors`}
    >
      <FontAwesomeIcon 
        icon={isOffline ? faWifi : faDownload} 
        className="mr-2"
      />
      {saving ? 'Zpracovávám...' : (isOffline ? 'Odebrat z offline' : 'Uložit pro offline')}
    </button>
  );
};

const CoursePage = ({ params }: { params: { courseId: string } }) => {
  const router = useRouter();
  const courseId = parseInt(params.courseId);

  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkOnline, setIsNetworkOnline] = useState(true);

  useEffect(() => {
    setIsNetworkOnline(isOnline());
    
    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchUserCourseData = useCallback(async () => {
    try {
      if (!navigator.onLine) {
        const offlineCourse = await getOfflineCourse(courseId.toString());
        
        if (offlineCourse) {
          setUserCourse({
            id: parseInt(courseId.toString()),
            progress: 0,
            completedAt: null,
            course: offlineCourse as Course
          });
          setCompletedLessons([]);
          setLoading(false);
          return;
        }
      }
      
      const token = Cookies.get('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const courseProgressRes = await axiosInstance.get(`/courses/${courseId}/progress`);
        const courseProgressData = courseProgressRes.data;
        
        if (!courseProgressData.userCourse) {
          setError("Neplatný formát dat: chybí userCourse");
          throw new Error("Neplatný formát dat: chybí userCourse");
        }
        
        if (!Array.isArray(courseProgressData.completedLessons)) {
          setError("Neplatný formát dat: completedLessons není pole nebo chybí");
          throw new Error("Neplatný formát dat: completedLessons není pole nebo chybí");
        }
        
        setUserCourse(courseProgressData.userCourse);
        setCompletedLessons(courseProgressData.completedLessons.map((cl: CompletedLesson) => cl.lessonId));
        
        if (courseProgressData.completedLessons.length > 0 && 
            courseProgressData.userCourse.course.lessons && 
            courseProgressData.userCourse.course.lessons.length > 0) {
          
          const completedLessonIds = courseProgressData.completedLessons.map((cl: CompletedLesson) => cl.lessonId);
          
          const firstUncompletedLessonIndex = courseProgressData.userCourse.course.lessons.findIndex(
            (lesson: Lesson) => !completedLessonIds.includes(lesson.id)
          );
          
          setCurrentLessonIndex(firstUncompletedLessonIndex === -1 
            ? courseProgressData.userCourse.course.lessons.length - 1
            : firstUncompletedLessonIndex
          );
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        setError(`API chyba: ${apiError instanceof Error ? apiError.message : 'Neznámá chyba'}`);
        throw apiError;
      }
    } catch (error) {
      setError(`Chyba při načítání: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    } finally {
      setLoading(false);
    }
  }, [courseId, router]);

  useEffect(() => {
    fetchUserCourseData();
  }, [courseId, fetchUserCourseData]);

  const markLessonAsCompleted = async (lessonId: number) => {
    if (!userCourse) return;
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      
      const res = await axiosInstance.post(`/courses/${courseId}/lesson/${lessonId}/complete`);
      const result = res.data;
      
      setCompletedLessons(prev => [...prev, lessonId]);
      
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
      
      await axiosInstance.post(`/courses/${courseId}/complete`);
      
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

  const formatLessonContent = (content: string) => {
    if (content.includes('<p>') || content.includes('<div>') || content.includes('<br')) {
      return content;
    }
    
    return content
      .split('\n\n')
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              {course.name}
            </h1>
            {!isNetworkOnline && (
              <div className="mt-1 text-sm text-yellow-400 flex items-center">
                <FontAwesomeIcon icon={faWifi} className="mr-1 opacity-50" />
                Offline režim
              </div>
            )}
            <p className="text-gray-400 mt-2 text-sm md:text-base max-w-2xl">{course.description}</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <OfflineButton 
              courseId={courseId.toString()} 
              courseData={course} 
            />
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-md"
            >
              Zpět na Dashboard
            </button>
          </div>
        </div>

        <div className="mb-8 bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span className="font-medium">Celkový pokrok v kurzu</span>
            <span className="font-bold">{userCourse.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${userCourse.progress}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4 pl-2 border-l-4 border-purple-500">Obsah kurzu</h2>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
                {course.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isActive = currentLessonIndex === index;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 transform ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg scale-102 ring-2 ring-purple-400'
                          : isCompleted
                          ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 shadow-md'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`text-sm ${isCompleted ? 'text-green-200' : 'text-gray-400'}`}>
                            {`Lekce ${index + 1}`}
                          </span>
                          <h3 className={`font-medium ${isCompleted ? 'text-white' : 'text-white'}`}>
                            {lesson.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm flex items-center ${isCompleted ? 'text-green-200' : 'text-gray-300'}`}>
                            <FontAwesomeIcon 
                              icon={faClock} 
                              className={`mr-1 ${isCompleted ? 'text-green-300' : 'text-purple-300'}`} 
                            />
                            {lesson.duration} min
                          </span>
                          {isCompleted && (
                            <FontAwesomeIcon icon={faCheck} className="text-green-200" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold mb-2 text-white">
                  {currentLesson.title}
                </h2>
                {currentLesson.subtitle && (
                  <p className="text-gray-300 text-lg">{currentLesson.subtitle}</p>
                )}
                <div className="flex items-center mt-3 text-sm text-gray-400">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-400" />
                  <span>{currentLesson.duration} minut čtení</span>
                  {isLessonCompleted && (
                    <span className="ml-4 flex items-center text-green-400">
                      <FontAwesomeIcon icon={faCheck} className="mr-1" /> 
                      Dokončeno
                    </span>
                  )}
                </div>
              </div>
              
              <div className="prose prose-invert prose-lg max-w-none">
                <div 
                  className="lesson-content"
                  dangerouslySetInnerHTML={{ __html: formatLessonContent(currentLesson.content) }} 
                />
              </div>
              
              <div className="mt-12 border-t border-gray-700 pt-6">
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => markLessonAsCompleted(currentLesson.id)}
                    disabled={isLessonCompleted || !isNetworkOnline}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 ${
                      isLessonCompleted
                        ? 'bg-green-600 cursor-not-allowed opacity-70'
                        : !isNetworkOnline
                        ? 'bg-gray-600 cursor-not-allowed opacity-70'
                        : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-md'
                    }`}
                  >
                    {isLessonCompleted ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="mr-1" /> Lekce dokončena
                      </>
                    ) : (
                      <>
                        Označit jako dokončené
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-3">
                  <button 
                    onClick={goToPreviousLesson}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 ${
                      currentLessonIndex === 0
                        ? 'bg-gray-700 cursor-not-allowed opacity-70'
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-md'
                    }`}
                    disabled={currentLessonIndex === 0}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Předchozí lekce
                  </button>
                  
                  {isLastLesson && allLessonsCompleted && isNetworkOnline ? (
                    <button
                      onClick={markCourseAsCompleted}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg transition-all duration-300 shadow-md"
                    >
                      Dokončit kurz <FontAwesomeIcon icon={faCheck} className="ml-1" />
                    </button>
                  ) : (
                    <button 
                      onClick={goToNextLesson}
                      className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 ${
                        currentLessonIndex === course.lessons.length - 1
                          ? 'bg-gray-700 cursor-not-allowed opacity-70'
                          : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-md'
                      }`}
                      disabled={currentLessonIndex === course.lessons.length - 1}
                    >
                      Další lekce <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .lesson-content p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }
        .lesson-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #d8b4fe;
        }
        .lesson-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #e9d5ff;
        }
        .lesson-content ul, .lesson-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .lesson-content li {
          margin-bottom: 0.5rem;
        }
        .lesson-content img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .lesson-content a {
          color: #a78bfa;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .lesson-content a:hover {
          color: #c4b5fd;
        }
        .lesson-content blockquote {
          border-left: 4px solid #a78bfa;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          color: #d1d5db;
        }
        .lesson-content pre {
          background: #1f2937;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .lesson-content code {
          background: #1f2937;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default CoursePage;