let currentRawLyrics = "";
let parsedLyrics = [];
let localProgress = 0;
let isPlaying = false;
let syncInterval;

// Fungsi mengubah format [mm:ss.xx] menjadi milidetik
function parseLRC(lrcText) {
  if (!lrcText || lrcText === "Lirik tidak ditemukan") return [];
  const lines = lrcText.split('\n');
  const parsed = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach(line => {
    const match = timeRegex.exec(line);
    if (match) {
      const m = parseInt(match[1], 10);
      const s = parseInt(match[2], 10);
      const ms = match[3].length === 2 ? parseInt(match[3], 10) * 10 : parseInt(match[3], 10);
      const time = (m * 60 * 1000) + (s * 1000) + ms;
      const text = line.replace(timeRegex, '').trim();
      if (text) parsed.push({ time, text });
    }
  });
  return parsed;
}

// Engine lokal agar lirik berjalan mulus di antara jeda polling 3 detik
function startLyricEngine() {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = setInterval(() => {
    if (isPlaying) {
      localProgress += 100; 
      updateLyricDisplay();
    }
  }, 100);
}

// Menampilkan lirik sesuai waktu saat ini
function updateLyricDisplay() {
  const lyricContainer = document.getElementById('lyrics-container');
  if (parsedLyrics.length === 0) {
    lyricContainer.innerText = "♪ Lirik tidak tersedia / Instrumental";
    return;
  }

  let currentLine = parsedLyrics[0].text;
  for (let i = 0; i < parsedLyrics.length; i++) {
    if (localProgress >= parsedLyrics[i].time) {
      currentLine = parsedLyrics[i].text;
    } else {
      break; 
    }
  }
  lyricContainer.innerText = currentLine;
}

window.api.onUpdateTrack((data) => {
  document.getElementById('track-title').innerText = data.title;
  document.getElementById('track-artist').innerText = data.artist || '-';
  if (data.albumArt) document.getElementById('album-art').src = data.albumArt;

  // Update Status & Resync Progress
  isPlaying = data.isPlaying;
  localProgress = data.progress; 
  
  // Kontrol Animasi Visualizer
  const visualizer = document.getElementById('visualizer');
  if (isPlaying) visualizer.classList.add('playing');
  else visualizer.classList.remove('playing');

  // Update Progress Bar UI
  if (data.duration > 0) {
    const progressPercent = (data.progress / data.duration) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
  }

  // Parse Lirik hanya jika lagunya berganti (teks lirik baru)
  if (data.lyrics && data.lyrics !== currentRawLyrics) {
    currentRawLyrics = data.lyrics;
    parsedLyrics = parseLRC(currentRawLyrics);
  }
});

// Mulai engine saat aplikasi berjalan
startLyricEngine();