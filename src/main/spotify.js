const { app, BrowserWindow } = require('electron');
const axios = require('axios');
const path = require('path');

// Panggil file konfigurasi rahasia
const config = require('./config');

// Gunakan variabel dari config
const clientId = config.CLIENT_ID;
const clientSecret = config.CLIENT_SECRET; 
const redirectUri = config.REDIRECT_URI;

let accessToken = null;
let refreshToken = null;

// Fungsi untuk membuka jendela login Spotify
async function loginSpotify() {
    return new Promise((resolve, reject) => {
        const authWindow = new BrowserWindow({ width: 500, height: 600, show: false });
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-currently-playing`;
        
        authWindow.loadURL(authUrl);
        authWindow.show();

        // Tangkap proses redirect
authWindow.webContents.on('will-redirect', async (event, newUrl) => {
    if (newUrl.includes(redirectUri)) {
        event.preventDefault(); // Mencegah Electron memuat URL dan menghilangkan error
        const url = new URL(newUrl);
        const code = url.searchParams.get('code');
        if (code) {
            authWindow.close();
            await getAccessToken(code);
            resolve();
        }
    }
});

// Tangkap proses navigasi (terkadang Spotify memicu event ini alih-alih redirect)
authWindow.webContents.on('will-navigate', async (event, newUrl) => {
    if (newUrl.includes(redirectUri)) {
        event.preventDefault(); // Mencegah Electron memuat URL
        const url = new URL(newUrl);
        const code = url.searchParams.get('code');
        if (code) {
            authWindow.close();
            await getAccessToken(code);
            resolve();
        }
    }
});
    });
}

// Fungsi untuk menukar kode dengan Access Token
async function getAccessToken(code) {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
    });
    const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${token}`
            }
        });
        accessToken = response.data.access_token;
    } catch (error) {
        console.error("Gagal mendapatkan token:", error.message);
    }
}

// Fungsi untuk mengecek lagu yang sedang diputar
async function getCurrentTrack() {
    if (!accessToken) return null;
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        return null;
    }
}

module.exports = { loginSpotify, getCurrentTrack };