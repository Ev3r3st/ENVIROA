import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from "../../components/navbar/navbar";
import PWAInstall from "../components/PWAInstall";
import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  themeColor: '#1F2937',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export const metadata = {
  title: 'EVO App',
  description: 'Aplikace pro sledování osobních cílů a vzdělávání',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EVO App',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <meta name="application-name" content="EVO App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EVO App" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1F2937" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} antialiased bg-cover bg-center min-h-screen lg:bg-desktop`}>
        <div className="fixed inset-0 w-full h-full -z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/app-image/background.png')",
              opacity: 1
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <PWAInstall />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
