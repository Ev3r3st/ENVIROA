import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen text-white font-sans mb-20 md:mt-20">
      <div className="w-full max-w-4xl mx-auto p-2">
        <div className="grid grid-cols-2 items-center">
          {/* Left section with logo and text */}
          <div className="flex items-center bg-white text-black rounded-full p-1 px-3 justify-self-start">
            <img
              src="/images/app-image/marenas-logo-octo.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-full mr-2"
            />
            <h1 className="text-xl font-bold">EVO</h1>
          </div>

          {/* Right section with user icon */}
          <div className="flex items-center justify-self-end">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-black font-bold">U</span>
            </div>
          </div>
        </div>

        <section className="bg-white text-black p-4 rounded-lg w-full text-center my-4">
          <p className="text-2xl italic px-2">
            “Dosáhněte vašeho cíle rychleji a úspěšněji.”
          </p>
          <p className="mt-2 text-sm">Krotil Matyáš</p>
        </section>

        <div className="flex flex-col items-center space-y-4 my-4 w-full">
          {/* Wrapper div with responsive flex layout */}
          <div className="flex gap-4 justify-center w-full">
            {/* First Card - Goals */}
            <div className="bg-gray-800 rounded-lg p-4 w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 text-center">
              <h2 className="text-lg font-semibold">Goals</h2>
              <div className="relative flex items-center justify-center mt-4">
                <svg className="w-24 h-24">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    strokeWidth="10"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-600"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    strokeWidth="10"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * 50) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 47.5 48)"
                    className="text-purple-500"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-white">
                  50 %
                </span>
              </div>
            </div>

            {/* Second Card - Day Streaks */}
            <div className="bg-gray-800 rounded-lg p-4 w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 text-center">
              <h2 className="text-lg font-semibold">Day Streaks</h2>
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full ${
                      index < 4 ? "bg-green-400" : "bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded">
                Keep it up!
              </button>
            </div>
          </div>
          <section className="ActualStudyModel w-full">
            <div className="bg-gray-800 rounded-lg p-4 w-full text-center">
              <h2 className="text-lg font-semibold border-b border-gray-600 pb-2">
                Modules in Progress
              </h2>
              {/* Module Title */}
              <p className="font-medium mt-2">Meditation for Success</p>
              <p className="text-sm text-gray-400">Lekce 2: Concentration</p>
              {/* Motivational Quotes */}
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <div className="flex text-center pb-1">
                  <h3 className="ml-3">#2 Concentration</h3>
                  <div className="pl-2 text-center flex  flex justify-end ml-auto mr-3">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-gray-400 w-[22px] "
                    />{" "}
                    <h3 className="px-1">8 min</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  začátek psaní, pro lekci kterou si každý vyzkouší atd, začátek
                  psaní, pro lekci kterou si každý vyzkouší atd, začátek psaní,
                  pro lekci kterou si každý vyzkouší atd, začátek psaní, pro
                  lekci kterou si každý....
                </p>
              </div>
              {/* Action Button */}
              <Link
                href="/educationPage"
                className="mt-5 px-4 py-2 bg-purple-500 text-white rounded block text-center"
              >
                Start Learning
              </Link>{" "}
              {/* Progress Bar */}
              <div className="w-full bg-gray-600 rounded-full h-2 mt-5">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-1">50% Completed</p>
              {/* Encouragement Text */}
              {/*<div className="mt-4 text-sm text-gray-400">
                <h4>Nadpis Lekce</h4>
                <p>začátek psaní, pro lekci kterou si každý vyzkouší atd</p>
              </div>*/}
              {/* Next Module Preview */}
              <div className="mt-5 p-3 bg-gray-700 rounded-lg text-center">
                <h3 className="font-semibold text-sm text-white">
                  Upcoming Module:
                </h3>
                <p className="text-xs text-gray-400">
                  Mindfulness for Productivity
                </p>
              </div>
            </div>
          </section>

          <div className="bg-gray-800 rounded-lg p-4 w-full text-center">
            <h2 className="text-lg font-semibold">Today tasks</h2>
            <div className="mt-4">
              <p>Goal #1</p>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>
            <div className="mt-4">
              <p>Goal #2</p>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded">
              Show tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
