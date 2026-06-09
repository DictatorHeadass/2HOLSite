import { NextRequest, NextResponse } from 'next/server';
import { recordDonation } from '@/app/actions';

// Webhook hit by the local TikTok Live bridge (bridge/tiktok-bridge.mjs) for
// each gift. Secured with a shared secret in the Authorization header.
//
// Expected JSON body:
//   { tiktokUserId?: string, handle: string, username?: string, coins: number }
export async function POST(req: NextRequest) {
    const secret = process.env.TIKTOK_WEBHOOK_SECRET;
    if (secret) {
        const auth = req.headers.get('authorization');
        if (auth !== `Bearer ${secret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    let body: { tiktokUserId?: string; handle?: string; username?: string; coins?: number };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!body.handle || !body.coins) {
        return NextResponse.json({ error: 'Missing handle or coins' }, { status: 400 });
    }

    const result = await recordDonation({
        tiktokUserId: body.tiktokUserId,
        handle: body.handle,
        username: body.username,
        coins: Number(body.coins),
    });

    if (!result.success) {
        return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
