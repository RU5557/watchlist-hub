# Project Blueprint: Multi-App Watchlist Aggregator & Search Launcher

## 1. Overview & Objective
A lightweight, mobile-first web dashboard (PWA) that aggregates user watchlists, continue-watching states, and metadata from **SIMKL** (or Trakt) API. Instead of complex deep-linking into playback streams, clicking a title and selecting an app (Stremio, Nuvio, Cloudstream, Netflix, Prime Video) triggers an **Android Intent / Custom URL Scheme** to open that target app directly to its search page with the title pre-filled.

---

## 2. Core Architecture & Tech Stack
* **Frontend:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript (or lightweight React/Vue if preferred for vibecoding).
* **Data Source (Backend/API):** SIMKL API (or Trakt API) fetched via Client-Side JavaScript (using `fetch` with API tokens).
* **Execution Environment:** Hosted locally or via Vercel/Netlify, accessed primarily via mobile browsers (Chrome/Kiwi) on Android Smartphones, Tablets, and Android TV browsers.

---

## 3. User Workflow
1. **Authentication:** User inputs their SIMKL API Client ID and User Token (or OAuth login flow).
2. **Dashboard View:** Displays a unified grid/list of items categorized into:
   * *Continue Watching* (In-progress shows/movies)
   * *Watchlist* (Saved items)
3. **Action Drawer / Modal:** Clicking a card opens a modal showing:
   * Title, Poster, Overview, Rating.
   * A row of **App Launch Buttons**: [Stremio] [Nuvio] [Cloudstream] [Netflix] [Prime Video].
4. **App Trigger (Intent Dispatch):** Clicking an app button executes a JavaScript intent redirect, launching the chosen app with the title string passed to its search handler.

---

## 4. Implementation Details & Code Blueprint

### 4.1. Android Intent Scheme Mapping for Search
To open target apps and pass search queries, use standard Android intent URIs or fallback web URLs:

* **Stremio:** `intent://search?q={ENCODED_TITLE}#Intent;package=com.stremio.one;end;`
* **Nuvio / General Media Apps:** Standard custom scheme or search intent URI.
* **Netflix / Prime Video:** Fallback to web search or standard app deep-links if supported, e.g., `https://www.netflix.com/search?q={ENCODED_TITLE}`.

### 4.2. Single-File Application Structure (`index.html`)

Here is the complete blueprint template for your vibecoding prompt:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watchlist Hub Launcher</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto p-4">
        <!-- Header -->
        <header class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Watchlist Hub</h1>
            <button id="settingsBtn" class="bg-slate-800 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-700">Settings</button>
        </header>

        <!-- Continue Watching Section -->
        <section class="mb-8">
            <h2 class="text-lg font-semibold mb-3 text-slate-300">Continue Watching</h2>
            <div id="continueWatchingGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <!-- Dynamic Content injected via JS -->
            </div>
        </section>

        <!-- Watchlist Section -->
        <section>
            <h2 class="text-lg font-semibold mb-3 text-slate-300">My Watchlist</h2>
            <div id="watchlistGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <!-- Dynamic Content injected via JS -->
            </div>
        </section>
    </div>

    <!-- Action Modal -->
    <div id="actionModal" class="fixed inset-0 bg-black/80 hidden items-center justify-center p-4 z-50">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 relative">
            <button id="closeModal" class="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
            <h3 id="modalTitle" class="text-xl font-bold mb-2"></h3>
            <p id="modalOverview" class="text-sm text-slate-400 mb-6 line-clamp-3"></p>
            
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Open and Search in App:</p>
            <div class="grid grid-cols-2 gap-3">
                <button onclick="launchApp('stremio')" class="bg-indigo-600 hover:bg-indigo-500 py-2.5 px-4 rounded-xl font-medium text-sm transition">Stremio</button>
                <button onclick="launchApp('nuvio')" class="bg-cyan-600 hover:bg-cyan-500 py-2.5 px-4 rounded-xl font-medium text-sm transition">Nuvio</button>
                <button onclick="launchApp('cloudstream')" class="bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 rounded-xl font-medium text-sm transition">Cloudstream</button>
                <button onclick="launchApp('netflix')" class="bg-red-600 hover:bg-red-500 py-2.5 px-4 rounded-xl font-medium text-sm transition">Netflix</button>
            </div>
        </div>
    </div>

    <script>
        // Placeholder state for vibecoding expansion
        let selectedTitle = '';

        function openModal(title, overview) {
            selectedTitle = title;
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalOverview').innerText = overview || 'No description available.';
            document.getElementById('actionModal').classList.remove('hidden');
            document.getElementById('actionModal').classList.add('flex');
        }

        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('actionModal').classList.add('hidden');
            document.getElementById('actionModal').classList.remove('flex');
        });

        function launchApp(appType) {
            const encodedQuery = encodeURIComponent(selectedTitle);
            let intentUrl = '';

            switch(appType) {
                let pkgName = '';
                case 'stremio':
                    pkgName = 'com.stremio.one';
                    break;
                case 'nuvio':
                    pkgName = 'com.nuvio.app'; // Update package name as needed
                    break;
                case 'cloudstream':
                    pkgName = 'com.lagradost.cloudstream3';
                    break;
                case 'netflix':
                    window.location.href = `https://www.netflix.com/search?q=${encodedQuery}`;
                    return;
            }

            // Android Intent dispatcher fallback
            intentUrl = `intent://search?q=${encodedQuery}#Intent;package=${pkgName};end;`;
            window.location.href = intentUrl;
        }
    </script>
</body>
</html>
```

---

## 5. Next Steps for Vibecoding
1. Copy the blueprint and single-file code template above into your AI coding assistant (e.g., Claude, Cursor, or ChatGPT).
2. Ask the assistant to integrate the **SIMKL API endpoints** (`https://api.simkl.com/sync/activities` or `https://api.simkl.com/users/settings`) using your API Client ID.
3. Deploy it as a local HTML file or push to GitHub Pages to access it seamlessly across your Android TV browser, tablet, and smartphone.