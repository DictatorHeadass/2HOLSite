// TikTok LIVE → Wall of Fame bridge.
//
// Vercel is serverless and can't hold the long-lived connection TikTok LIVE
// needs, so this small script runs on YOUR machine while you stream. It
// connects to your live room, listens for gifts, and POSTs each one to the
// site's secured webhook (/api/tiktok/gift), which accumulates coins per donor.
//
// Setup:  copy .env.example -> .env, fill it in, then:  npm install && npm start

import 'dotenv/config';
import { WebcastPushConnection } from 'tiktok-live-connector';

const USERNAME = process.env.TIKTOK_USERNAME?.replace(/^@/, '');
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const SECRET = process.env.TIKTOK_WEBHOOK_SECRET;

if (!USERNAME || !WEBHOOK_URL) {
    console.error('Missing config. Set TIKTOK_USERNAME and WEBHOOK_URL in bridge/.env');
    process.exit(1);
}

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

    postDonation({
        tiktokUserId: data.userId ? String(data.userId) : data.uniqueId,
        handle: data.uniqueId,
        username: data.nickname,
        coins,
    });
});

conn.on('streamEnd', () => console.log('— Stream ended.'));
conn.on('disconnected', () => console.log('— Disconnected from TikTok.'));

conn
    .connect()
    .then((state) => {
        console.log(`Connected to @${USERNAME}'s LIVE (room ${state.roomId}).`);
        console.log('Listening for gifts… (Ctrl+C to stop)');
    })
    .catch((err) => {
        console.error('Failed to connect. Are you live right now?');
        console.error(err?.message || err);
        process.exit(1);
    });
