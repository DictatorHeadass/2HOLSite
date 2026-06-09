// TikTok LIVE → Wall of Fame bridge (always-on worker).
//
// Vercel is serverless and can't hold the long-lived connection TikTok LIVE
// needs, so this small worker runs separately — ideally on an always-on host
// (Railway/Fly/etc.) so it's fully hands-off. It keeps trying to connect to
// your live room; the moment you go live it starts forwarding gifts to the
// site's secured webhook (/api/tiktok/gift), and when your stream ends it
// quietly waits and reconnects for the next one.
//
// Local use is identical: copy .env.example -> .env, then `npm install && npm start`.

import 'dotenv/config';
import http from 'node:http';
import { WebcastPushConnection } from 'tiktok-live-connector';

const USERNAME = process.env.TIKTOK_USERNAME?.replace(/^@/, '');
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const SECRET = process.env.TIKTOK_WEBHOOK_SECRET;
const PORT = process.env.PORT || 8080;
const RETRY_MS = Number(process.env.RETRY_MS || 30000); // how often to retry when offline

if (!USERNAME || !WEBHOOK_URL) {
    console.error('Missing config. Set TIKTOK_USERNAME and WEBHOOK_URL (env vars or bridge/.env).');
    process.exit(1);
}

// --- live state, exposed via a tiny health endpoint so hosts stay happy ---
let state = { status: 'starting', connected: false, username: USERNAME, lastGiftAt: null, roomId: null };
let reconnectTimer = null;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(state));
}).listen(PORT, () => console.log(`Health endpoint on :${PORT}`));

const conn = new WebcastPushConnection(USERNAME);

async function postDonation(payload) {
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(SECRET ? { Authorization: `Bearer ${SECRET}` } : {}),
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            console.error(`✗ Webhook ${res.status}:`, await res.text());
        } else {
            console.log(`✓ +${payload.coins} coins from @${payload.handle} (${payload.username || '—'})`);
        }
    } catch (err) {
        console.error('✗ Webhook request failed:', err.message);
    }
}

conn.on('gift', (data) => {
    // Streakable gifts (giftType === 1) fire repeatedly while held; only count
    // the final event (repeatEnd) so we don't double-tally. One-off gifts fire once.
    if (data.giftType === 1 && !data.repeatEnd) return;

    const repeat = data.repeatCount || 1;
    // diamondCount is the gift's coin value; multiply by how many were sent.
    const coins = (data.diamondCount || 0) * repeat;
    if (coins <= 0) return;

    state.lastGiftAt = new Date().toISOString();
    postDonation({
        tiktokUserId: data.userId ? String(data.userId) : data.uniqueId,
        handle: data.uniqueId,
        username: data.nickname,
        coins,
    });
});

conn.on('streamEnd', () => {
    console.log('— Stream ended. Will watch for the next one.');
    state.connected = false;
    state.status = 'waiting';
    scheduleReconnect();
});

conn.on('disconnected', () => {
    console.log('— Disconnected from TikTok.');
    state.connected = false;
    state.status = 'waiting';
    scheduleReconnect();
});

conn.on('error', (err) => {
    console.error('Connector error:', err?.message || err);
});

function scheduleReconnect() {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connect, RETRY_MS);
}

async function connect() {
    try {
        const s = await conn.connect();
        state.connected = true;
        state.status = 'live';
        state.roomId = s.roomId;
        console.log(`Connected to @${USERNAME}'s LIVE (room ${s.roomId}). Listening for gifts…`);
    } catch (err) {
        // Most common reason: you're simply not live right now. Keep waiting.
        state.connected = false;
        state.status = 'waiting';
        console.log(`Not live / can't connect (${err?.message || err}). Retrying in ${RETRY_MS / 1000}s…`);
        scheduleReconnect();
    }
}

connect();
