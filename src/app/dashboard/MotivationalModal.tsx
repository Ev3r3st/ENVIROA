"use client";

import React from "react";

interface MotivationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
  emoji: string;
}

const MotivationalModal: React.FC<MotivationalModalProps> = ({
  isOpen,
  onClose,
  quote,
  emoji,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            {emoji} Denní motivace {emoji}
          </h3>
          <button 
            onClick={onClose}
            className="text-white p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm mb-4">
          <div className="text-center mb-2">
            <span className="text-3xl">{emoji}</span>
          </div>
          <p className="text-lg text-white italic">&quot;{quote}&quot;</p>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
        >
          <span className="mr-2">Pokračovat</span> 🚀
        </button>
      </div>
    </div>
  );
};

export default MotivationalModal; 