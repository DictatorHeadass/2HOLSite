@echo off
title TikTok Wall of Fame Bridge
cd /d "%~dp0"
echo Starting TikTok Wall of Fame bridge...
echo Leave this window open while you stream. Close it (or press Ctrl+C) to stop.
echo.
node tiktok-bridge.mjs
echo.
echo Bridge stopped. Press any key to close.
pause >nul
