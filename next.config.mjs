// next.config.mjs – Next 14 + next‑pwa v6
import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Základní konfigurace Next.js
 */
const baseNextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  compiler: {
    // Vypisujeme console.* jen v devu
    removeConsole: !isDev,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },

  images: {
    domains: ['localhost'],
    unoptimized: true, // obrázky necháme raw kvůli precache
  },
};

/**
 * Konfigurace PWA / Workbox
 * – žádné nedefinované klíče uvnitř!
 */
const runtimeCaching = [
  // Google Fonts
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts-cache',
      expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
    },
  },
  // Stránky aplikace
  {
    urlPattern: ({ url }) =>
      url.origin === self.location.origin &&
      (url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/courses') ||
        url.pathname === '/'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages-cache',
      expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
    },
  },
  // Statické soubory Nextu
  {
    urlPattern: /\/_next\/static\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-cache',
      expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  // Optimalizované obrázky Next Image
  {
    urlPattern: /\/_next\/image\?url=.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'image-cache',
      expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  // Assets (fonts, images, …)
  {
    urlPattern: /\.(?:eot|ttf|woff|woff2|png|jpg|jpeg|svg|gif|webp)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'asset-cache',
      expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  // Všechno ostatní
  {
    urlPattern: /^https?.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'offline-cache',
      expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
      networkTimeoutSeconds: 10,
    },
  },
];

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
  mode: 'production', // i v devu generuj full SW

  importScripts: ['/sw-custom.js'], // vlastní skript po Workboxu
  swDest: 'public/sw.js',

  buildExcludes: [
    /middleware-manifest\.json$/,
    /app-build-manifest\.json$/,
    /_buildManifest\.js$/,
    /_ssgManifest\.js$/,
  ],

  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
  runtimeCaching,

  fallbacks: {
    document: '/offline.html',
  },
});

export default withPWAConfig(baseNextConfig);