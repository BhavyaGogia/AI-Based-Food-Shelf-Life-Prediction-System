const CACHE_NAME = 'himshakti-threejs-cache-v1';
const ASSETS_TO_CACHE = [
  '/starfield.html',
  '/storm.html',
  '/cosmic.html',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/build/three.module.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/postprocessing/EffectComposer.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/postprocessing/RenderPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/postprocessing/ShaderPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/postprocessing/UnrealBloomPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/shaders/GammaCorrectionShader.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/shaders/CopyShader.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/postprocessing/Pass.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/postprocessing/MaskPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.143.0/examples/jsm/shaders/LuminanceHighPassShader.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache successful responses from CDN or local HTML files
        if (response.status === 200 && (
          event.request.url.includes('jsdelivr.net') ||
          event.request.url.includes('.html')
        )) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
