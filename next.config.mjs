import withPWAInit from 'next-pwa'; // Přejmenováno pro jasnost

// Původní Next.js konfigurace
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  compiler: { removeConsole: process.env.NODE_ENV !== 'development' },
  images: { domains: ['localhost'], unoptimized: true },
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:3001/api/:path*' }];
  },
};

// Konfigurace pro next-pwa
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  swDest: 'public/sw.js',
  importScripts: ['/sw-custom.js'], 
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, 
  
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-cache',
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|eot|ttf|woff|woff2)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'asset-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    
    {
       urlPattern: /\/api\/.*$/i,
       method: 'GET',
       handler: 'NetworkFirst', 
       options: {
         cacheName: 'apis',
         networkTimeoutSeconds: 10, 
         expiration: { maxEntries: 16, maxAgeSeconds: 24 * 60 * 60 },
       }
     },
  ],

 
  additionalManifestEntries: [
    { url: '/offline.html', revision: null }, 
  ],

  

});


export default withPWA(nextConfig);