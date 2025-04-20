'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });
          console.log('Service worker registered:', registration.scope);

          // Watch for new updates
          registration.onupdatefound = () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.onstatechange = () => {
              if (worker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // new content available
                  worker.postMessage({ type: 'SKIP_WAITING' });
                  console.log('New service worker activated – reloading.');
                  window.location.reload();
                } else {
                  console.log('Content cached for offline use.');
                }
              }
            };
          };
        } catch (err) {
          console.error('SW registration failed:', err);
        }
      };

      window.addEventListener('load', registerSW);
      return () => window.removeEventListener('load', registerSW);
    }
  }, []);

  return null;
}