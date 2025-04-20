"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const OfflinePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md text-center">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Není připojení k internetu
        </h1>
        <p className="text-gray-300 mb-6">
          Tato stránka není dostupná v offline režimu. Některé funkce aplikace jsou však stále k dispozici.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Přejít na Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Zkusit znovu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage; 