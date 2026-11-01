# Watchlist Hub — Workflow (Berdasarkan Dokumentasi Resmi SIMKL)

Sumber: `https://api.simkl.org` (Auth V2, Sync Guide, Headers, Errors) & `stremio-simkl` (referensi pola implementasi).

---

## 1. Autentikasi (OAuth V2 PKCE)

PWA adalah **Mobile/Desktop/Browser Apps** client type. Menurut dokumentasi SIMKL:
- Client type ini **tidak punya `client_secret`** (hanya Server apps & services yang punya).
- Menggunakan **PKCE** (Proof Key for Code Exchange) sebagai pengganti client_secret.
- Scope: `media:read media:write`

### Langkah-langkah:
1. User klik "Login ke SIMKL"
2. PWA generate `code_verifier` (random 43–128 char) dan `code_challenge` (SHA256 dari verifier, base64url)
3. PWA redirect user ke:
   `https://simkl.com/oauth2/authorize?client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>&response_type=code&code_challenge=<CHALLENGE>&code_challenge_method=S256&state=<STATE>&scope=media:read%20media:write`
4. User login & approve di SIMKL
5. SIMKL redirect kembali ke PWA: `<REDIRECT_URI>?code=AUTH_CODE&state=<STATE>`
6. PWA exchange code ke token:
   `POST https://api.simkl.com/oauth2/token`
   Body JSON: `{ "code": "...", "client_id": "...", "code_verifier": "...", "redirect_uri": "...", "grant_type": "authorization_code" }`
   **Tidak ada `client_secret`** (public client).
7. SIMKL return: `{ "access_token": "...", "refresh_token": "...", "expires_in": 604800 }`
   - Access token: 7 hari
   - Refresh token: 180 hari (sliding window)
8. Simpan `access_token` + `refresh_token` ke `localStorage` untuk semua API call berikutnya.

---

## 2. Sync Data (Two-Phase Model)

Menurut SIMKL Sync Guide, sinkronisasi harus melalui dua fase:

### Phase 1 — Initial Sync (saat pertama kali login)
1. `GET /sync/activities` — simpan seluruh response sebagai `snapshot` (untuk gate setiap poll selanjutnya)
2. `GET /sync/all-items?extended=full` — ambil semua item watchlist (shows, movies, anime)
3. `GET /sync/playback` — ambil semua paused playback sessions
4. Simpan snapshot hanya jika semua call sukses

### Phase 2 — Continuous Sync (saat user interaksi: app launch, wake, pull-to-refresh)
1. `GET /sync/activities` — bandingkan `all` timestamp dengan snapshot yang disimpan
2. Jika sama → tidak ada perubahan, stop
3. Jika berbeda → fetch delta dengan `date_from=snapshot_all`
4. Merge delta ke cache, simpan snapshot baru

### Aturan penting
- **Jangan polling `all-items` tanpa `activities` dulu** → akan di-rate limit / suspended
- **Sync hanya saat user interaksi** (app launch, wake from background, pull-to-refresh), throttle 15–30 menit
- **Tidak ada background polling timer**

---

## 3. Endpoint Mapping

| Endpoint | Method | Purpose | Header yang wajib |
|----------|--------|---------|-------------------|
| `GET /sync/activities` | GET | Timestamp per kategori (gate sync) | `Authorization: Bearer <token>`, `User-Agent` |
| `GET /sync/all-items?extended=full` | GET | Ambil semua watchlist (shows, movies, anime) | `Authorization: Bearer <token>`, `User-Agent` |
| `GET /sync/playback` | GET | Ambil paused playback sessions | `Authorization: Bearer <token>`, `User-Agent` |
| `GET /tv/{id}?extended=full` | GET | Detail TV show | `Authorization: Bearer <token>`, `User-Agent` |
| `GET /movies/{id}?extended=full` | GET | Detail movie | `Authorization: Bearer <token>`, `User-Agent` |
| `GET /anime/{id}?extended=full` | GET | Detail anime | `Authorization: Bearer <token>`, `User-Agent` |
| `POST /oauth2/token` | POST | Exchange code ke token | `Content-Type: application/json` |

### Header & Query Parameter (wajib setiap request)
```
URL params: ?client_id=<CLIENT_ID>&app-name=<app-name>&app-version=<version>
Headers:
  Authorization: Bearer <access_token> (untuk endpoint user data)
  User-Agent: <app-name>/<version>
  simkl-api-key: <CLIENT_ID> (alternatif untuk client_id query param)
```

---

## 4. Response Structure (sesuai dokumentasi)

### `/sync/activities`
```json
{
  "all": "2026-05-08T14:23:11Z",
  "tv_shows": { "all": "...", "watching": "...", "plantowatch": "...", "playback": "...", ... },
  "movies": { "all": "...", "plantowatch": "...", "playback": "...", ... },
  "anime": { ... }
}
```

### `/sync/all-items?extended=full`
Response berisi 3 kunci: `shows`, `movies`, `anime`. Setiap kunci adalah array item.
Setiap item memiliki struktur:
```json
{
  "title": "...",
  "overview": "...",
  "status": "watching",
  "show": { "title": "...", "overview": "...", "ids": { "simkl": 12345, "tmdb": "...", "tvdb": "..." }, "poster": "57/5742576cd8f59fcb0", ... },
  "movie": { "title": "...", ... },
  "anime": { "title": "...", ... }
}
```
Hanya salah satu dari `show`, `movie`, atau `anime` yang terisi tergantung tipe item.

### `/sync/playback`
```json
[
  { "type": "episode", "episode": { ... }, "anime": { ... }, "progress": 63, ... },
  { "type": "movie", "movie": { ... }, "progress": 41, ... }
]
```

### `/tv/{id}`, `/movies/{id}`, `/anime/{id}`
```json
{
  "title": "...",
  "year": 2011,
  "type": "show",
  "ids": { "simkl": 17465, "slug": "...", "imdb": "...", "tmdb": "...", "tvdb": "..." },
  "poster": "57/5742576cd8f59fcb0",
  "fanart": "65/6517069dc223b367",
  "overview": "...",
  "genres": ["Drama", "Fantasy"],
  "runtime": 52,
  "certification": "TV-MA",
  "country": "US",
  "original_language": "en",
  "status": "ended",
  "network": "HBO",
  "first_aired": "2011-04-17",
  "last_aired": "2019-05-19",
  "ratings": { "simkl": { "rating": 9.1, "votes": 1270 }, "imdb": { "rating": 9.2, "votes": 2287000 } },
  "trailers": [ { "name": "...", "youtube": "...", "size": 1080, "type": "trailer" } ]
}
```

---

## 5. Aturan Penting
- **Poster URL**: `https://simkl.in/posters/{path}_m.jpg` (contoh: `https://simkl.in/posters/57/5742576cd8f59fcb0_m.jpg`)
- **Fanart URL**: `https://simkl.in/fanart/{path}_m.jpg`
- **Semua tanggal**: ISO 8601 UTC, jangan reformat
- **Rate limit**: 10 GET/sec, 1 POST/sec per client
- **Access token expiry**: 7 hari; **Refresh token expiry**: 180 hari (sliding)

---

## 6. Render UI (sesuai dokumen)

| Section | Sumber data | Filter |
|---------|-------------|--------|
| Continue Watching | `/sync/playback` | Items yang sedang dipause (max 9) |
| My Watchlist | `/sync/all-items` | `status === 'watching'` (max 9) |
| Plan to Watch | `/sync/all-items` | `status === 'plantowatch'` (max 9) |

Setiap item di grid:
- Klik → fetch detail `/tv/{id}`, `/movies/{id}`, atau `/anime/{id}`
- Tampilkan modal: rating, genre, runtime, certification, network, country, status, first/last aired, language, fanart, trailer (YouTube), overview
- Tombol intent launcher ke: Stremio, Nuvio, Cloudstream, Netflix

---

## 7. Aktifitas yang Harus Dilakukan PWA
1. Login OAuth V2 PKCE (simpan `access_token` + `refresh_token` di `localStorage`)
2. Fetch `sync/activities` sebagai snapshot pertama
3. Fetch `sync/all-items?extended=full` untuk daftar lengkap
4. Fetch `sync/playback` untuk continue watching
5. Render 3 section: Continue Watching, Watchlist (watching), Plan to Watch (plantowatch)
6. Klik kartu → fetch detail `/tv/{id}`, `/movies/{id}`, `/anime/{id}` → tampilkan modal
7. Intent launcher ke aplikasi Android (Stremio, Nuvio, Cloudstream, Netflix)
