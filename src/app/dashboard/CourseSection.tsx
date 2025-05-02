"use client";

import React from "react";
import { UserCourse } from "./interfaces";
import { useRouter } from "next/navigation";

interface CourseSectionProps {
  activeCourse: UserCourse | null;
  userCourses: UserCourse[];
  isOffline?: boolean;
}

const CourseSection: React.FC<CourseSectionProps> = ({ activeCourse, userCourses, isOffline = false }) => {
  const router = useRouter();

  const goToCourse = (courseId: number) => {
    router.push(`/courses/${courseId}`);
  };

  const goToCourses = () => {
    router.push("/courses");
  };

  return (
    <>
      {/* Aktivní kurz */}
      <div className="w-full bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Váš aktivní kurz</h2>

        {activeCourse ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">
                {activeCourse.course.name}
                {isOffline && (
                  <span className="ml-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
                    Offline
                  </span>
                )}
              </h3>
              <span className="text-sm text-gray-400">
                {activeCourse.progress}% dokončeno
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${activeCourse.progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-400 line-clamp-2">
              {activeCourse.course.description}
            </p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => goToCourse(activeCourse.course.id)}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Pokračovat v kurzu
              </button>

              {!isOffline && (
                <button
                  onClick={goToCourses}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Změnit kurz
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="mb-4">
              {isOffline 
                ? "V offline režimu nejsou k dispozici žádné kurzy." 
                : "Nemáte aktivní kurz. Vyberte si z našich vzdělávacích kurzů."}
            </p>
            {!isOffline && (
              <button
                onClick={goToCourses}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Prohlédnout kurzy
              </button>
            )}
          </div>
        )}
        {!isOffline && (
          <div className="mt-5 p-3 bg-gray-700 rounded-lg text-center">
            <h3 className="font-semibold text-sm text-white">
              Upcoming Module:
            </h3>
            <p className="text-xs text-gray-400">
              Mindfulness for Productivity
            </p>
          </div>
        )}
      </div>
      @next/next/no-img-element
      {/* Seznam všech kurzů uživatele */}
      {!isOffline && (
        <section className="w-full max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 w-full text-center my-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Moje kurzy</h2>
              <button
                onClick={() => router.push("/courses")}
                className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Prozkoumat kurzy
              </button>
            </div>

            {userCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Zatím nemáte žádné kurzy</p>
                <button
                  onClick={() => router.push("/courses")}
                  className="mt-4 px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Začít s kurzy
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userCourses.map(({ course, progress }) => (
                  <div key={course.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-left font-medium">
                          {course.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {course.description}
                        </p>
                      </div>
                      {course.image && (
                        <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-16 h-16 object-cover rounded-lg ml-4"
                        /></>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Pokrok</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className="w-full mt-4 px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Pokračovat v kurzu
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default CourseSection; 