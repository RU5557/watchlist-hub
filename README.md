# Watchlist Hub

PWA Dashboard untuk agregasi watchlist SIMKL dan pencarian langsung ke aplikasi streaming (Stremio, Nuvio, Cloudstream, Netflix).

## Fitur
- **Integrasi SIMKL API**: Ambil data *Continue Watching* & *Watchlist* otomatis
- **Intent Launcher**: Langsung cari/buka judul di aplikasi pilihan di Android (`com.stremio.one`, `app.nuvio.player`, `com.lagradost.cloudstream3`, Netflix)
- **PWA Support**: Bisa di-install sebagai aplikasi mobile/desktop
- **Mobile First**: Responsif untuk smartphone, tablet, dan Android TV browser

## Cara Pakai
1. Buka `index.html` di browser (atau host di Vercel/GitHub Pages/Netlify)
2. Klik tombol **Settings**
3. Masukkan **Client ID** SIMKL (dapatkan gratis di [simkl.com/api](https://simkl.com/api/))
4. Opsional: Masukkan **User Token** jika ingin sync watchlist pribadi
5. Simpan dan nikmati!

## Deploy
Cukup upload semua file ke provider hosting statis seperti Vercel, Netlify, atau GitHub Pages.
