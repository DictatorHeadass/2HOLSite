# TikTok Live → Wall of Fame bridge

Your site runs on Vercel (serverless), which **cannot** hold the long-lived
connection TikTok LIVE requires. This little script runs on your own computer
while you stream. It connects to your live room, watches for gifts, and pushes
each one to the site's secured webhook, which adds the coins to that viewer's
running total on the **Wall of Fame** tab.

```
TikTok LIVE  ──►  this bridge (your PC)  ──►  POST /api/tiktok/gift  ──►  donors table  ──►  Wall of Fame
```

## One-time setup

1. **Set the webhook secret on the site.** In your Vercel project → Settings →
   Environment Variables, add:

   | Name | Value |
   |------|-------|
   | `TIKTOK_WEBHOOK_SECRET` | a long random string you make up |

   Redeploy so it takes effect. (If you skip this, the webhook accepts anyone —
   fine for quick testing, not for production.)

2. **Configure the bridge.** In this `bridge/` folder:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   - `TIKTOK_USERNAME` – your TikTok handle
   - `WEBHOOK_URL` – `https://<your-site>/api/tiktok/gift`
   - `TIKTOK_WEBHOOK_SECRET` – the **same** value you set in Vercel

3. **Install dependencies** (once):

   ```bash
   npm install
   ```

## Every stream

Start your TikTok LIVE, then run:

```bash
npm start
```

You'll see `✓ +N coins from @handle` for each gift. Leave it running for the
whole stream; stop it with `Ctrl+C`. The Wall of Fame updates automatically.

## Notes

- **Coins value:** TikTok exposes each gift's *diamond* value, which this bridge
  uses as the coin amount (× quantity for multi-sends). If you'd rather weight it
  differently, change the `coins` calculation in `tiktok-bridge.mjs`.
- **Tiers** (Bronze 1–99 / Silver 100–499 / Gold 500–999 / Diamond 1000+) are
  defined in `lib/constants.ts` (`DONATION_TIERS`) and are easy to retune.
- **Manual entry:** logged-in admins ("Eve") can also add or top up donors and
  set the "building in their honor" note directly on the Wall of Fame tab — handy
  for testing without going live, or for off-stream gifts.
- This folder is independent of the Next.js app and is **not** bundled into the
  Vercel build.
```
