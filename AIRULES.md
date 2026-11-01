# AIRULES — Watchlist Hub

## Janji Kerja
Saya (AI) berjanji **tidak akan bereksperimen atau menebak-tebak** dalam mengembangkan project ini. Setiap baris kode, setiap endpoint, setiap header, dan setiap parameter harus didasarkan pada **dokumentasi resmi yang sudah ada**.

## Sumber Kebenaran Tunggal
1. **WORKFLOW.md** — Alur kerja yang dielaborate dari dokumentasi resmi SIMKL (`api.simkl.org`) dan `stremio-simkl`. Ini adalah referensi kebenaran tunggal.
2. **Dokumentasi resmi SIMKL** — `https://api.simkl.org` dan panduan di bawahnya (Sync, Auth, Headers, Errors).
3. **Kode referensi stremio-simkl** — `https://github.com/nktfh100/stremio-simkl` (hanya untuk verifikasi pola implementasi, bukan untuk menambah fitur baru).

## Aturan Keras (Tidak Boleh Dilanggar)

### 1. Tidak ada opini AI
Jika dokumentasi tidak menyebutkan sesuatu, jangan ditambahkan. Jika dokumentasi berbeda dengan asumsi saya, dokumentasi yang menang.

### 2. Endpoint hanya dari WORKFLOW.md
Hanya gunakan endpoint yang tercantum di WORKFLOW.md. Jangan menambahkan endpoint baru tanpa memperbarui WORKFLOW.md terlebih dahulu berdasarkan dokumentasi resmi.

### 3. Header & Parameter wajib
Setiap request ke SIMKL API harus menyertakan:
- `client_id` (query param atau `simkl-api-key` header)
- `app-name` (query param)
- `app-version` (query param)
- `User-Agent` (header)
- `Authorization: Bearer <access_token>` (untuk endpoint user data)

### 4. Auth hanya OAuth V2 PKCE
- Hanya gunakan AUTH V2 PKCE (bukan V1, bukan client_secret untuk public client).
- `client_secret` **tidak boleh** digunakan untuk client type "Mobile, desktop & browser apps" (hanya untuk "Server apps & services").
- Simpan `access_token` + `refresh_token` di `localStorage`.
- Auto-refresh token saat menerima `401 Unauthorized`.

### 5. Response structure harus sesuai dokumentasi
Jangan asumsi struktur response. Baca dokumentasi SIMKL untuk setiap endpoint. Contoh:
- `detail.ids.simkl` (bukan `detail.id`)
- `item.show.ids.simkl` (bukan `item.ids.simkl` untuk item dari `/sync/all-items`)
- Poster URL: `https://simkl.in/posters/{path}_m.jpg`

### 6. Perubahan harus di-dokumentasi di WORKFLOW.md
Setiap menambah/mengubah endpoint, header, atau alur kerja, harus memperbarui WORKFLOW.md terlebih dahulu sebelum mengubah `index.html`.

### 7. Jangan bereksperimen
Jika fitur belum ada di WORKFLOW.md dan dokumentasi resmi, jangan diimplementasikan. Selesaikan fitur yang sudah ada terlebih dahulu.

## Konsekuensi Pelanggaran
Jika pelanggaran ditemukan, saya akan:
1. Menghentikan implementasi fitur tersebut
2. Membaca ulang WORKFLOW.md dan dokumentasi resmi
3. Merefaktor kode agar sesuai dokumentasi
4. Memperbarui AIRULES.md jika perlu

---
*Dibuat untuk mencegah regresi bug akibat bereksperimen AI.*
