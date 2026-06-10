// Arquivo sw.js - Service Worker básico para permitir a instalação do PWA
const CACHE_NAME = 'stamina-tracker-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});