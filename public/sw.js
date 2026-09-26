const CACHE_NAME = 'ibs-nutrition-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './icon-192.svg',
  './icon-512.svg',
  './src/main.tsx',
  './src/App.tsx',
  './src/index.css',
  './src/App.css',
];

const I18N_ASSETS = [
  './locales/it/translation.json',
  './locales/en/translation.json',
  './locales/es/translation.json',
  './locales/fr/translation.json',
  './locales/de/translation.json',
];

/**
 * Aggiunge in cache gli asset statici principali durante l'installazione.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((error) => {
        console.warn('[SW] Cache statica fallita:', error);
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Elimina le cache obsolete e prende il controllo delle pagine client.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Intercetta le richieste e applica strategie cache-first per asset statici
 * e network-first per le traduzioni JSON.
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Non intercettare richieste non GET o di estensioni non HTTP(S).
  if (request.method !== 'GET') {
    return;
  }

  // Network-first per i file di traduzione: le nuove chiavi sono prelevate quando online.
  if (isTranslationRequest(url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first per le risorse statiche dell'app.
  event.respondWith(cacheFirst(request));
});

function isTranslationRequest(url) {
  return (
    url.pathname.startsWith('/locales/') && url.pathname.endsWith('.json')
  );
}

/**
 * Strategia cache-first: serve dalla cache se presente, altrimenti prova la rete
 * e salva il risultato in cache.
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Fetch fallito (offline?):', request.url, error);
    throw error;
  }
}

/**
 * Strategia network-first: prova sempre la rete per avere le traduzioni più
 * aggiornate; in fallback usa la cache.
 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    console.warn('[SW] Nessuna cache disponibile per:', request.url);
    throw error;
  }
}
