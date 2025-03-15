"use client"
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// filepath: c:\Users\matyk\EVO-APP\FRONTEND\ENVIROA\src\app\modules\page.tsx



const LearningModulesPage: React.FC = () => {
    const router = useRouter();

    // Mock data for courses
    const courses = [
        { id: 1, name: "Design Basics", description: "Learn the fundamentals of design." },
        { id: 2, name: "UI/UX Principles", description: "Master the principles of user experience." },
        { id: 3, name: "Typography Essentials", description: "Understand the art of typography." },
        { id: 4, name: "Color Theory", description: "Explore the science of colors." },
        { id: 5, name: "Web Design", description: "Learn how to design for the web." },
        { id: 6, name: "Mobile App Design", description: "Create stunning mobile app interfaces." },
        { id: 7, name: "Prototyping", description: "Learn how to create interactive prototypes." },
        { id: 8, name: "Design Systems", description: "Build scalable design systems." },
        { id: 9, name: "Accessibility in Design", description: "Design for everyone." },
        { id: 10, name: "Advanced Design Techniques", description: "Take your design skills to the next level." },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white">
            <div className="w-full max-w-4xl mx-auto p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Learning Modules</h1>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:scale-105 transition-transform"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Course List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
                        >
                            <h2 className="text-xl font-semibold">{course.name}</h2>
                            <p className="text-gray-400 mt-2">{course.description}</p>
                            <Link
                                href={`/modules/${course.id}`}
                                className="mt-4 inline-block px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                Start Learning
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearningModulesPage;