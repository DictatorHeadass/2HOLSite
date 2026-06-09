# TikTok Live → Wall of Fame bridge

Your site runs on Vercel (serverless), which **cannot** hold the long-lived
connection TikTok LIVE requires. This small worker does that job. Deploy it once
to an always-on host and forget about it: it keeps watching for your live, starts
forwarding gifts the moment you go on, and reconnects itself when the stream ends.

```
TikTok LIVE  ──►  this worker (always-on host)  ──►  POST /api/tiktok/gift  ──►  donors table  ──►  Wall of Fame
```

It also serves a tiny health page at `/` (JSON: status / connected / lastGiftAt)
so you can check it's alive.

---

## Recommended: deploy to Railway (hands-off, ~$5/mo)

> Railway is the simplest always-on option. It no longer has a free tier — the
> Hobby plan is ~$5/mo and this tiny worker fits comfortably inside that. If you
> want truly free, see "Other hosts" below.

1. **Set the secret on your site first.** In Vercel → your project → Settings →
   Environment Variables, add `TIKTOK_WEBHOOK_SECRET` = a long random string, and
   redeploy.

2. Go to **railway.app** → **New Project** → **Deploy from GitHub repo** → pick
   `DictatorHeadass/2HOLSite`.

3. Open the service → **Settings** → set **Root Directory** to `bridge`.
   *(Critical — this tells Railway to run the worker, not build the whole website.)*

4. **Variables** tab → add:
   | Name | Value |
   |------|-------|
   | `TIKTOK_USERNAME` | your TikTok handle |
   | `WEBHOOK_URL` | `https://<your-site>/api/tiktok/gift` |
   | `TIKTOK_WEBHOOK_SECRET` | the **same** string you put in Vercel |

5. Deploy. Watch the **Logs** — you'll see `Not live… retrying` until you go
   live, then `Connected to @you's LIVE` and `✓ +N coins from @viewer` per gift.

That's it. It runs 24/7; you never start or stop anything.

---

## Free + always-on: Google Cloud (recommended for $0)

The easy free PaaS hosts (Fly.io, Koyeb, Render free) all **sleep** when idle,
which drops the TikTok connection — so they don't work for this. The genuinely
free, never-sleeping option is a Google Cloud **Always Free** `e2-micro` VM.

➡️ **Full copy-paste walkthrough: [`DEPLOY-GoogleCloud.md`](./DEPLOY-GoogleCloud.md)**

It's $0 forever within the free tier (a card is needed only for ID verification),
runs 24/7, and survives reboots/crashes via a systemd service.

## Other hosts

The worker is just a standard Node process (`npm start`), so it runs anywhere
that stays on. Set the same three env vars (`TIKTOK_USERNAME`, `WEBHOOK_URL`,
`TIKTOK_WEBHOOK_SECRET`) wherever you deploy.

- **Oracle Cloud Always Free** — also free + 24/7 and beefier than Google's, but
  the free ARM VMs are often "out of capacity" at signup. Same VM steps as the
  Google guide once you have the box.
- **Railway** — easiest UI, but ~$5/mo (no free tier). Set Root Directory to
  `bridge`; `railway.json` here configures the rest.
- **A VPS / Raspberry Pi / old laptop** — clone the repo, `cd bridge`,
  `npm install`, then use the systemd service from the Google guide to keep it alive.

---

## Run locally (only while you stream)

If you'd rather not host it, run it on your PC during streams:

```bash
cp .env.example .env   # then fill it in
npm install
npm start
```

Leave it running for the stream; `Ctrl+C` to stop. Same behavior, just only on
while your PC is on.

---

## Notes

- **Coins value:** TikTok exposes each gift's *diamond* value, which this worker
  uses as the coin amount (× quantity for multi-sends). To weight it differently,
  edit the `coins` calculation in `tiktok-bridge.mjs`.
- **Tiers** (Bronze 1–99 / Silver 100–499 / Gold 500–999 / Diamond 1000+) live in
  `lib/constants.ts` (`DONATION_TIERS`) and are easy to retune.
- **Manual entry:** logged-in admins ("Eve") can add/top-up donors and set the
  honored-building note directly on the Wall of Fame tab — handy for testing or
  off-stream gifts.
- `tiktok-live-connector` is **unofficial** (it speaks the same protocol as
  TikTok's web player). It's the standard tool for gift overlays/alerts, but
  because it's unofficial it occasionally needs a version bump if TikTok changes
  things. It only sees gifts while you're actually live.
- This folder is independent of the Next.js app and is **not** bundled into the
  Vercel build.
```
