import React from 'react';
import { useOfflineCourses } from '../hooks/useOfflineData';

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    description: string;
  }[];
}

interface CourseSectionProps {
  courses: Course[];
}

const CourseSection: React.FC<CourseSectionProps> = ({ courses }) => {
  const { data: offlineCourses, loading, error } = useOfflineCourses();

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3 mt-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Nepodařilo se načíst kurzy. Zkuste to prosím později.
      </div>
    );
  }

  const allCourses = [...courses, ...(offlineCourses || [])];

  if (!allCourses || allCourses.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        Žádné kurzy k zobrazení.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {allCourses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {course.lessons?.length || 0} lekcí
              </span>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-200"
                onClick={() => {/* Implementace zobrazení kurzu */}}
              >
                Zobrazit kurz
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseSection; 