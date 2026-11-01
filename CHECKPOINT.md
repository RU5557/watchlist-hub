# Watchlist Hub - Checkpoint v6 (SUCCESS - Android Intent Launcher Fixed)

**Status:** ✅ FULLY WORKING - Package intent Android untuk Nuvio (`app.nuvio.player`) dan Cloudstream (`com.lagradost.cloudstream3`) sudah disesuaikan agar langsung meluncurkan aplikasi dengan mulus.

---

## 📁 FILE PENTING
- `index.html` — Single file PWA (Tailwind v4 CDN + Vanilla JS) dengan Android Intent Launcher
- `WORKFLOW.md` — Dokumentasi workflow lengkap dari api.simkl.org + stremio-simkl
- `manifest.json`, `sw.js`, `favicon.svg` — PWA assets
- `README.md` — Cara pakai
- `CHECKPOINT.md` — File ini (riwayat pekerjaan)

---

## 🚀 ARSITEKTUR & UPDATE TERBARU

### App Intent Launcher (Android Mobile)
- **Stremio**: `intent://search?q={q}#Intent;package=com.stremio.one;end;`
- **Nuvio**: `intent://search?q={q}#Intent;package=app.nuvio.player;end;`
- **Cloudstream**: `intent://details?q={q}#Intent;package=com.lagradost.cloudstream3;end;`
- **Netflix**: `https://www.netflix.com/search?q={q}`

### Auth (OAuth V2 PKCE) & Two-Phase Sync
- Terintegrasi penuh dengan SIMKL API v2 (PKCE, token exchange, auto-refresh pada 401).
|-------|--------|
| Login OAuth V2 PKCE | ✅ |
| Simpan token ke localStorage | ✅ |
| Auto-refresh token | ✅ |
| Continue Watching (/sync/playback) | ✅ |
| My Watchlist (status:watching) | ✅ |
| Plan to Watch (status:plantowatch) | ✅ |
| Detail metadata per item | ✅ |
| Trailer link (YouTube) | ✅ |
| Intent launcher ke app Android | ✅ |
| PWA (manifest + sw) | ✅ |

---

## 🔗 CARA TEST
1. Buka `https://ru5557.github.io/watchlist-hub/`
2. Masukkan Client ID (dari simkl.com/settings/developer/)
3. Login via SIMKL → approve
4. Data watchlist muncul di 3 section
5. Klik kartu → modal detail lengkap
6. Klik tombol app → redirect ke aplikasi Android
