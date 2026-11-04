// =============================================================================
// CC 106 – APPLICATION DEVELOPMENT AND EMERGING TECHNOLOGIES
// Lab Act. No. 3: Service Worker (Network-First Caching & Offline Fallback Pages)
// Project: BrewSync POS & Inventory System
// =============================================================================

const CACHE_NAME = 'brew-sync-network-first-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_PRECACHE = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  '/images/logo192.png',
  '/images/logo512.png'
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. Installation Phase (Precaching App Shell & Offline Fallback)
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Install Event triggered');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching App Shell & Offline Fallback Assets...');
      return cache.addAll(ASSETS_TO_PRECACHE);
    })
  );
  // Forces the waiting Service Worker to become the active Service Worker
  self.skipWaiting();
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Activation Phase (Cache Cleanup)
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate Event - Cleaning old caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          })
      );
    }).then(() => {
      // Take control of all open pages immediately
      return self.clients.claim();
    })
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Fetch Event Listener (Caching Strategies)
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // A. Navigation Requests (HTML Pages) -> Strategy: Network First with Offline Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Open cache and save fresh copy from network (Dynamic Caching)
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          console.warn('[SW] Navigation failed. Falling back to cache or offline.html');
          // Step 1: Try finding the page in cache
          return caches.match(event.request).then((cachedResponse) => {
            // Step 2: If page isn't in cache, show custom offline.html fallback
            return cachedResponse || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // B. Static Assets (Styles, Images, Fonts) -> Strategy: Cache First (Lesson 3)
  if (
    event.request.destination === 'style' ||
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    event.request.url.startsWith('https://cdn.jsdelivr.net')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return networkResponse;
          })
        );
      })
    );
    return;
  }

  // C. Dynamic & API Requests -> Strategy: Network First, Falling Back to Cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
