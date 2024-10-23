/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precache alle gegenereerde bestanden van de build
precacheAndRoute(self.__WB_MANIFEST);

// Intercept navigatieverzoeken en geef het index.html-bestand terug
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    // Check of het geen navigatieverzoek is
    if (request.mode !== 'navigate') return false;
    // Negeer speciale bestanden met '/_' in de URL
    if (url.pathname.startsWith('/_')) return false;
    // Negeer URL's met een bestandsextensie (bijv. .js, .css)
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Firebase Storage afbeeldingen cachen
registerRoute(
  ({ url }) => url.origin.includes('firebasestorage.googleapis.com'),
  new StaleWhileRevalidate({
    cacheName: 'firebase-images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // Maximaal aantal afbeeldingen dat wordt gecachet
        maxAgeSeconds: 30 * 24 * 60 * 60, // Bewaar de afbeeldingen maximaal 30 dagen
      }),
    ],
  })
);

// Lokale en externe afbeeldingen (jpg, png, etc.) cachen
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'general-images-cache', // Aangepaste cache-naam om verwarring te voorkomen
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60, // Maximaal aantal afbeeldingen dat wordt gecachet
        maxAgeSeconds: 30 * 24 * 60 * 60, // Bewaar de afbeeldingen maximaal 30 dagen
      }),
    ],
  })
);

// Luister naar berichten om de service worker direct te updaten
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activeer de nieuwe service worker en neem onmiddellijk controle over alle clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
