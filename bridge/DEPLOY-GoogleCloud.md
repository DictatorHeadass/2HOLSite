# Deploy the bridge free on Google Cloud (always-on, 24/7)

This runs the TikTok worker on Google Cloud's **Always Free** `e2-micro` VM —
$0 forever as long as you stick to the settings below. Once it's set up it runs
on its own: it survives reboots, restarts itself if it crashes, and catches
every stream automatically (even if you stream from your phone).

Total time: ~20 minutes. You'll copy-paste commands — you don't need to know Linux.

> 💳 Google requires a credit/debit card to verify you, but the e2-micro VM in
> the regions below is in the **Always Free** tier and won't be charged. You also
> get a $300 trial credit as a safety net. Don't change the machine type or
> region and you stay free.

---

## Part A — Prep your site (5 min, one time)

1. **Vercel** → your project → **Settings → Environment Variables** → add:
   - `TIKTOK_WEBHOOK_SECRET` = a long random string (make one up, e.g. mash 30+
     characters). **Save this string** — you'll paste it again in Part C.
   - Redeploy the project so it takes effect.

2. **Create the donors table:** visit `https://<your-site>/api/seed` once in your
   browser. You should see `{"message":"Database seeded successfully"}`.

---

## Part B — Create the free VM (8 min)

1. Go to **https://console.cloud.google.com** and sign in. Accept the free trial
   if prompted (this is where the card goes).

2. Top bar → **project dropdown** → **New Project** → name it `tiktok-bridge` →
   **Create**, then make sure that project is selected.

3. Search bar at the top → type **"VM instances"** → open it. If asked, click
   **Enable** on the Compute Engine API and wait ~1 minute.

4. Click **Create Instance** and set **exactly** these (this is what keeps it free):

   | Field | Value |
   |-------|-------|
   | **Name** | `tiktok-bridge` |
   | **Region** | `us-west1` *(or `us-central1` / `us-east1` — must be one of these)* |
   | **Series** | `E2` |
   | **Machine type** | `e2-micro` |
   | **Boot disk** | click **Change** → Disk type **Standard persistent disk**, Size **10 GB**, OS **Debian 12** |
   | **Firewall** | leave unchecked (you don't need inbound web traffic) |

5. Click **Create**. After ~30 seconds you'll see your VM in the list.

6. In the VM row, click the **SSH** button. A black terminal window opens in your
   browser — that's your VM. Everything below is pasted into that window.

---

## Part C — Install and start the worker (5 min)

Paste these blocks into the SSH window one at a time (right-click → Paste, or
Ctrl+Shift+V), pressing Enter after each.

**1. Install Node.js and git:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs git
```

**2. Get the code and install dependencies:**

```bash
cd ~ && git clone https://github.com/DictatorHeadass/2HOLSite.git && cd 2HOLSite/bridge && npm install
```

> If the repo is **private**, the clone will ask for a username/password. Either
> make the repo public, or create a GitHub token (github.com → Settings →
> Developer settings → Personal access tokens) and paste that as the password.

**3. Create your config file.** Paste this, but **replace the three values**
first (keep the quotes off, keep them on their own lines):

```bash
cat > ~/2HOLSite/bridge/.env <<'EOF'
TIKTOK_USERNAME=your_tiktok_handle
WEBHOOK_URL=https://your-site.vercel.app/api/tiktok/gift
TIKTOK_WEBHOOK_SECRET=the_same_secret_you_put_in_vercel
EOF
```

- `TIKTOK_USERNAME` — your TikTok handle (no `@` needed)
- `WEBHOOK_URL` — your real site URL + `/api/tiktok/gift`
- `TIKTOK_WEBHOOK_SECRET` — the **exact** string from Part A

**4. Quick test** (optional — confirms it works before making it permanent):

```bash
cd ~/2HOLSite/bridge && npm start
```

You should see `Health endpoint on :8080` and `Not live / can't connect …
Retrying in 30s…`. That "not live" line is correct when you're not streaming.
Press **Ctrl+C** to stop the test.

---

## Part D — Make it run forever (5 min)

This registers the worker as a background service that auto-starts on boot and
restarts if it ever crashes.

**1. Create the service** (paste as-is — it auto-detects your username):

```bash
sudo tee /etc/systemd/system/tiktok-bridge.service > /dev/null <<EOF
[Unit]
Description=TikTok Wall of Fame bridge
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/2HOLSite/bridge
ExecStart=/usr/bin/node tiktok-bridge.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

**2. Turn it on:**

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now tiktok-bridge
```

**3. Check it's alive:**

```bash
sudo systemctl status tiktok-bridge --no-pager
```

Look for **`active (running)`** in green. Press `q` to exit.

**Done.** You can close the SSH window and the browser — the worker keeps
running on the VM 24/7. Go live on TikTok and gifts will appear on your Wall of
Fame automatically.

---

## Everyday + maintenance

- **Watch live logs** (open SSH, then):
  ```bash
  journalctl -u tiktok-bridge -f
  ```
  You'll see `✓ +N coins from @viewer` as gifts come in. `Ctrl+C` to stop watching
  (the service keeps running).

- **You changed the code / pushed an update** — pull it and restart:
  ```bash
  cd ~/2HOLSite && git pull && cd bridge && npm install && sudo systemctl restart tiktok-bridge
  ```

- **Edit your settings** (handle/secret): `nano ~/2HOLSite/bridge/.env`, change,
  save with `Ctrl+O` Enter, exit `Ctrl+X`, then
  `sudo systemctl restart tiktok-bridge`.

- **Stop it for good:** `sudo systemctl disable --now tiktok-bridge`.

## Staying free — quick checklist

- Machine type is **e2-micro**, region is **us-west1 / us-central1 / us-east1**.
- Boot disk is **Standard** (not SSD), **≤30 GB**.
- Only **one** always-free VM per account.
- Our traffic (one TikTok connection + tiny webhook posts) is far under the free
  egress allowance, so bandwidth isn't a concern.
