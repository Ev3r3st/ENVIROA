'use client';

import { AppProps } from 'next/app';
import { useEffect } from 'react';
import InstallPWA from '../components/InstallPWA';
import '../app/globals.css';
import axiosInstance from '@/services/axios';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registrován:', registration);

          if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              console.log('Notifikace povoleny');
              
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
              });
              
              await axiosInstance.post('/notifications/subscribe', subscription);
              
              console.log('Push Notification Subscribed:', subscription);
            }
          }
        } catch (error) {
          console.error('Chyba při registraci Service Workeru:', error);
        }
      });

      window.addEventListener('controllerchange', () => {
        console.log('Service Worker byl aktualizován');
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Vítejte v EVO App!', {
            body: 'Aplikace je připravena k použití.',
            icon: '/icons/icon-192x192.png'
          });
        }
      }, 5000);
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <InstallPWA />
    </>
  );
}

export default MyApp; 