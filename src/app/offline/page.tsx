'use client';

import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="text-6xl mb-4">📡</div>
      <h1 className="text-3xl font-bold mb-4">Není připojení k internetu</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Tato stránka není dostupná offline. Některé funkce aplikace jsou ale stále k dispozici.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          Přejít na dashboard
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          Zkusit znovu
        </button>
      </div>
    </div>
  );
} 