const CACHE_NAME = 'watchlist-hub-v3';
const DYNAMIC_CACHE = 'watchlist-hub-dynamic';

const STATIC_ASSETS = [
    './manifest.json',
    './favicon.svg'
];

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
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET' || req.url.includes('/.netlify')) return;

    if (req.headers.get('Accept').includes('text/html')) {
        // Network-first for HTML - always get latest from server
        e.respondWith(
            fetch(req).then(resp => {
                if (resp && resp.status === 200) {
                    const cloned = resp.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(req, cloned);
                    });
                }
                return resp;
            }).catch(() => {
                return caches.match('/').then(cached => cached || new Response(offlinePage, {
                    headers: { 'Content-Type': 'text/html' }
                }));
            })
        );
    } else {
        // Cache-first for non-HTML (CSS, JS, images, etc.)
        e.respondWith(
            caches.match(req).then(cached => {
                if (cached) return cached;
                return fetch(req).then(resp => {
                    if (resp && resp.status === 200) {
                        const cloned = resp.clone();
                        caches.open(DYNAMIC_CACHE).then(cache => {
                            cache.put(req, cloned);
                        });
                    }
                    return resp;
                });
            })
        );
    }
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME && key.startsWith('watchlist-hub-')) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});