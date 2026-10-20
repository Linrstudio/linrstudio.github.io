# PremierePop party server

Zero-dependency Node WebSocket relay for the PremierePop Chrome extension
(synced anime premiere watch rooms). Rooms are ephemeral and in-memory;
nothing is stored. Only the room host's playback sync is relayed, and
danmaku/chat pass a basic filter + rate limit before fan-out.

Run locally: `node server.js` (listens on $PORT or 8787, `/health` for checks)

Deployed on Render (free web service). Note: free services spin down when
idle — the first connection after a quiet period can take ~30-60s to wake.
Hosts should open the room a few minutes before the premiere starts.

Extension setup: paste the service's wss:// URL into
PremierePop → Settings → Party server.
