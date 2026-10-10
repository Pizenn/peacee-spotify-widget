const { app, BrowserWindow, dialog } = require('electron');
// Penangkap error global: mencegah aplikasi langsung menutup
process.on('uncaughtException', (error) => {
  dialog.showErrorBox('Aplikasi Crash!', `Pesan Error: ${error.message}\n\nDetail: ${error.stack}`);
});
process.on('unhandledRejection', (reason, promise) => {
  dialog.showErrorBox('Error Async!', `Pesan: ${reason}\n\nSilakan cek koneksi atau fungsi API.`);
});

const path = require('path');
const axios = require('axios');
const { loginSpotify, getCurrentTrack } = require('./spotify'); // Path tetap karena satu folder

let win;
let isAuthenticating = true;
let currentTrackId = null;
let currentLyrics = null;

// Fungsi untuk mengambil lirik dari LRCLIB
async function getLyrics(trackName, artistName, durationMs) {
  try {
    const durationSec = Math.round(durationMs / 1000);
    const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(trackName)}&artist_name=${encodeURIComponent(artistName)}&duration=${durationSec}`;
    const response = await axios.get(url);
    // Prioritaskan lirik yang memiliki format waktu [00:10.00] (syncedLyrics)
    return response.data.syncedLyrics || response.data.plainLyrics || "Lirik tidak ditemukan";
  } catch (error) {
    return "Lirik tidak ditemukan";
  }
}

function createWindow () {
  win = new BrowserWindow({
    width: 480,       // Lebarkan sedikit agar ada ruang bayangan (dari 450)
    height: 95,      // Tinggikan sedikit agar ada ruang bayangan (dari 130)
    frame: false,
    transparent: true, // Pastikan ini tetap true
    backgroundColor: '#00000000',
    alwaysOnTop: false,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,  // Aktifkan bayangan OS jika didukung
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  // Arahkan ke index.html yang baru
  win.loadFile(path.join(__dirname, '../renderer/index.html'));

  //untuk debugging
  //win.webContents.openDevTools({ mode: 'detach' });

  setInterval(async () => {
    const trackData = await getCurrentTrack();
    //untuk debugging di terminal
    //console.log("Data dari Spotify:", trackData ? trackData.item?.name : "Kosong/Tidak ada lagu");
    if (trackData && trackData.item) {
      if (trackData.item.id !== currentTrackId) {
        currentTrackId = trackData.item.id;
        currentLyrics = await getLyrics(trackData.item.name, trackData.item.artists[0].name, trackData.item.duration_ms);
      }
      win.webContents.send('update-track', {
        title: trackData.item.name,
        artist: trackData.item.artists.map(a => a.name).join(', '),
        progress: trackData.progress_ms,
        duration: trackData.item.duration_ms,
        albumArt: trackData.item.album.images[0]?.url,
        isPlaying: trackData.is_playing,
        lyrics: currentLyrics // Kirim lirik ke UI
      });
    }
  }, 3000);
}

app.whenReady().then(async () => {
  await loginSpotify();
  isAuthenticating = false;
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !isAuthenticating) app.quit();
});

// 2. Tambahkan ini di bagian BAWAH file (untuk mencegah aplikasi mati otomatis)
app.on('window-all-closed', (e) => {
  // Cegah penutupan otomatis saat jendela login Spotify tertutup
  e.preventDefault();
});