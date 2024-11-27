// page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-indigo-900 flex flex-col items-center justify-start p-10 space-y-20">
      {/* Hero Section */}
      <div className="bg-white text-black rounded-xl shadow-2xl w-full max-w-7xl p-16 space-y-10 text-center">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 animate-pulse">
          Unlock Your Potential with Our Revolutionary App
        </h1>
        <p className="text-2xl text-gray-800 leading-relaxed">
          Imagine having all the tools you need to transform your life at your
          fingertips. Our app empowers you to achieve your goals, optimize your
          productivity, and take charge of your self-development. Dive in and
          discover how your ambitions can become reality.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleLoginRedirect}
            className="px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 rounded-full text-3xl font-bold text-white transition-transform transform hover:scale-110 shadow-xl"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-7xl space-y-16">
        <h2 className="text-5xl font-bold text-white text-center">
          Features That Set You Apart
        </h2>
        <div className="flex flex-wrap justify-around space-y-12 sm:space-y-0">
          <div className="bg-white rounded-xl shadow-lg p-10 w-full sm:w-1/3 m-6 hover:shadow-2xl transition-shadow duration-300">
            <Image
              src="/images/productivity.png"
              alt="Productivity Tools"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h3 className="text-3xl font-bold text-center mb-4">
              Productivity Tools
            </h3>
            <p className="text-gray-700 text-center text-lg">
              Boost your productivity with cutting-edge tools that keep you
              focused and help you achieve more.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-10 w-full sm:w-1/3 m-6 hover:shadow-2xl transition-shadow duration-300">
            <Image
              src="/images/goal_tracking.png"
              alt="Goal Tracking"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h3 className="text-3xl font-bold text-center mb-4">
              Goal Tracking
            </h3>
            <p className="text-gray-700 text-center text-lg">
              Set, track, and achieve your goals effectively with our innovative
              and easy-to-use tracking system.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-10 w-full sm:w-1/3 m-6 hover:shadow-2xl transition-shadow duration-300">
            <Image
              src="/images/self_improvement.png"
              alt="Self Improvement"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h3 className="text-3xl font-bold text-center mb-4">
              Self Improvement
            </h3>
            <p className="text-gray-700 text-center text-lg">
              Access tailored resources to help you grow both personally and
              professionally, and become the best version of yourself.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full max-w-7xl space-y-16">
        <h2 className="text-5xl font-bold text-white text-center">
          What Our Users Say
        </h2>
        <div className="flex flex-wrap justify-around space-y-12 sm:space-y-0">
          <div className="bg-white rounded-xl shadow-lg p-10 w-full sm:w-1/3 m-6 hover:shadow-2xl transition-shadow duration-300">
            <p className="text-gray-700 italic mb-6">
              "This app has completely transformed how I set and achieve my
              goals. Highly recommended!"
            </p>
            <h4 className="text-2xl font-bold text-center">- Alex Johnson</h4>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-10 w-full sm:w-1/3 m-6 hover:shadow-2xl transition-shadow duration-300">
            <p className="text-gray-700 italic mb-6">
              "I love the productivity tools. They help me stay focused and
              organized every day."
            </p>
            <h4 className="text-2xl font-bold text-center">- Maria Lopez</h4>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-10 w-full sm:w-1/3 m-6 hover:shadow-2xl transition-shadow duration-300">
            <p className="text-gray-700 italic mb-6">
              "The self-improvement resources are fantastic. I feel more
              confident and motivated than ever."
            </p>
            <h4 className="text-2xl font-bold text-center">- James Carter</h4>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-16 space-y-10 text-center">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Ready to Take the Next Step?
        </h2>
        <p className="text-2xl text-gray-800 leading-relaxed">
          Join our growing community of driven individuals and start turning
          your dreams into reality today.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="px-16 py-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-700 hover:to-blue-800 rounded-full text-3xl font-bold text-white transition-transform transform hover:scale-110 shadow-xl"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default HomePage;
