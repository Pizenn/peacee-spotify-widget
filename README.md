# 🎵 Spotify Desktop Widget

Widget desktop kustom untuk Spotify dengan desain antarmuka *glassmorphism* yang melayang (floating) elegan di desktop Windows-mu.

## ✨ Fitur Utama
- **Desain Modern:** Efek *glassmorphism* (kaca transparan) dengan sudut membulat yang menyatu dengan desktop.
- **Informasi Real-time:** Menampilkan sampul album, judul lagu, dan nama artis secara langsung.
- **Lirik Sinkron (Real-time):** Menampilkan lirik lagu berjalan sesuai ketukan lagu menggunakan API LRCLIB.
- **Kontrol Pemutaran:** Tombol *Previous*, *Play/Pause*, dan *Next* langsung dari widget (membutuhkan Spotify Premium).
- **Audio Visualizer:** Animasi bar sederhana yang merespons saat lagu diputar.
- **Portable Executable:** Dapat di-*build* menjadi file `.exe` mandiri yang bisa dijalankan tanpa membuka terminal.

## 🛠️ Teknologi yang Digunakan
- [Electron.js](https://www.electronjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [LRCLIB API](https://lrclib.net/) (Sumber Lirik)

## 📋 Persyaratan Sistem
Sebelum menjalankan proyek ini, pastikan kamu memiliki:
1. **Node.js** terinstal di komputermu.
2. Akun **Spotify Premium** (wajib untuk menggunakan fitur kontrol *Play/Pause/Next* melalui API).
3. **Client ID** dan **Client Secret** dari [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

## 🚀 Instalasi & Persiapan

**1. Clone Repositori**
```bash
git clone [https://github.com/username-kamu/spotify-widget.git](https://github.com/username-kamu/spotify-widget.git)
cd spotify-widget
npm install
2. Setup Spotify Developer
- Buka Spotify Developer Dashboard.
- Buat aplikasi baru (Create App).
- Masuk ke menu Settings pada aplikasi yang baru dibuat.
- Tambahkan URI ini persis ke dalam kolom Redirect URIs: http://localhost:8888/callback
- Simpan perubahan, lalu catat Client ID dan Client Secret milikmu.

3. Konfigurasi Kredensial Rahasia
Demi keamanan, file kredensial diabaikan oleh Git dan tidak disertakan di repositori ini. Kamu wajib membuatnya secara manual:
- Buat file baru bernama config.js di dalam folder src/main/.
- Salin format berikut ke dalam file config.js tersebut dan ganti dengan milikmu:

JavaScript
// src/main/config.js
module.exports = {
    CLIENT_ID: 'MASUKKAN_CLIENT_ID_KAMU_DI_SINI',
    CLIENT_SECRET: 'MASUKKAN_CLIENT_SECRET_KAMU_DI_SINI',
    REDIRECT_URI: 'http://localhost:8888/callback'
};

Cara Menjalankan Aplikasi
Mode Development (Dengan Watcher CSS otomatis):

Bash
npm run dev
Mode Standar:

Bash
npm start

Build ke Aplikasi Windows (.exe)
Untuk menjadikan proyek ini sebagai aplikasi Windows portabel yang siap diklik ganda:

Bash
npm run build
Proses build akan menghasilkan file Spotify Widget.exe di dalam folder dist/. File ini bersifat portable, sehingga bisa kamu pindahkan ke desktop atau didaftarkan ke Startup Windows agar otomatis menyala saat laptop dihidupkan.

Catatan Penting
Mengapa Lirik Kosong? Widget menggunakan database terbuka dari komunitas (LRCLIB). Jika tertulis "Lirik tidak tersedia / Instrumental", berarti lirik lagu tersebut memang belum diunggah ke database mereka.

Otentikasi: Saat aplikasi dijalankan pertama kali, akan ada jendela pop-up otentikasi Spotify. Kamu harus menyetujui akses tersebut agar widget mendapatkan izin membaca dan mengontrol lagu yang sedang diputar.

Dibuat dengan ❤️ untuk pengalaman mendengarkan musik yang lebih estetis.