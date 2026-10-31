const CACHE_NAME = 'watchlist-hub-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg'
];

// Import Tailwind CSS (pakai CDN)
const TAILWIND_CSS = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';

// Font awesome fallback (tidak pakai)
// const FA_CSS = '...';

let offlinePage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watchlist Hub - Offline</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans">
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div class="w-16 h-16 mb-6 rounded-full bg-indigo-900/50 flex items-center justify-center">
            <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
        </div>
        <h1 class="text-2xl font-bold mb-2">Watchlist Hub Offline</h1>
        <p class="text-slate-400 mb-6">Tidak ada koneksi internet. Silakan coba lagi nanti.</p>
        <button onclick="window.location.href=window.location.origin" class="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-medium transition">
            Coba Lagi
        </button>
    </div>
</body>
</html>
`;

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET' || req.url.includes('/.netlify')) return;

    e.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;
            return fetch(req).catch(() => new Response(offlinePage, { headers: { 'Content-Type': 'text/html' } }));
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
});