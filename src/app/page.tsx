import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen text-white font-sans mb-20">
      <div className="grid grid-cols-2 items-center w-full p-2">
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

      <section className="bg-white text-black p-4 rounded-lg w-4/5 text-center my-4">
        <p className="text-lg italic">
          “Dosáhněte vašeho cíle rychleji a úspěšněji.”
        </p>
        <p className="mt-2 text-sm">Krotil Matyáš</p>
      </section>

      <div className="flex flex-col items-center w-4/5 space-y-4 my-4">
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* First Card - Goals */}
          <div className="bg-gray-800 rounded-lg p-4 w-full text-center">
            <h2 className="text-lg font-semibold">Goals</h2>

            {/* Circle Progress */}
            <div className="relative flex items-center justify-center mt-4">
              <svg className="w-24 h-24">
                {/* Background circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  strokeWidth="10"
                  fill="none"
                  stroke="currentColor"
                  className="text-gray-600"
                />
                {/* Progress circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  strokeWidth="10"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="283" // celková délka kruhu
                  strokeDashoffset={283 - (283 * 50) / 100} // posunutí pro znázornění 15 %
                  strokeLinecap="round"
                  transform="rotate(-90 47.5 48)" // rotace o -90°, aby pokrok začínal nahoře
                  className="text-purple-500" // barva kruhu pokroku
                />
              </svg>
              {/* Procentuální text uvnitř kruhu */}
              <span className="absolute text-2xl font-bold text-white">
                50 %
              </span>
            </div>
          </div>

          {/* Second Card - Modules in progress */}
          <div className="bg-gray-800 rounded-lg p-4 w-full text-center">
            <h2 className="text-lg font-semibold">Day Streaks</h2>
            <p className="font-medium mt-2"></p>

            {/* Day Streak Circles */}
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

            {/* Current Streak Progress */}
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
        <div className="bg-gray-800 rounded-lg p-4 w-full text-center">
          <div className="border-b-[1px] border-gray-600">
            <h2 className="text-lg font-semibold ">Modules in progress</h2>
          </div>
          <p className="font-medium mt-2">Meditation for success</p>
          <p className="text-sm text-gray-400">Lekce 2: Concentration</p>
          <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: "50%" }}
            ></div>
          </div>
          <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded">
            Start learn
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 w-full ">
          <h2 className="text-lg font-semibold text-center">Today tasks</h2>
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
      {/** 
      <footer className="flex justify-around bg-gray-800 w-full py-3 fixed bottom-0">
        <button className="text-white text-lg">Home</button>
        <button className="text-white text-lg">Modules</button>
        <button className="text-white text-lg">Profile</button>
        <button className="text-white text-lg">Cart</button>
      </footer>*/}
    </div>
  );
}
