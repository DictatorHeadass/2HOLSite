@echo off
REM Supervisor: keeps the TikTok bridge running, restarting it if it ever exits.
REM The bridge handles "not live" retries itself; this loop is just a crash safety net.
cd /d "%~dp0"
:loop
node tiktok-bridge.mjs
timeout /t 10 /nobreak >nul
goto loop
