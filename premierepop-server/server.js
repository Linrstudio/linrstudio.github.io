'use strict';
/*
 * PremierePop party server — zero-dependency Node WebSocket relay.
 * Run:  node server.js        (PORT env, default 8787)
 * Deploy anywhere Node runs (Render / Railway / Fly / a VPS). Put it behind
 * TLS (the platform's https URL) and paste the wss:// URL into the
 * extension's Options page.
 *
 * Design notes (cost control is the whole game):
 * - Rooms are ephemeral and in-memory. Nothing is persisted, no accounts.
 * - Only the room host's playback sync is relayed.
 * - Every danmaku/chat passes the same basic filter + rate limit as the
 *   client, so the obvious abuse is dropped before it fans out.
 */
const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 8787;
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_TEXT = 80;
const PROFANITY = ['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard', 'rape', 'porn', 'hentai'];
function badText(t) {
  const s = ' ' + String(t || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ') + ' ';
  return PROFANITY.some(w => s.includes(' ' + w + ' ') || (w.length >= 5 && s.includes(w)));
}

// rooms: code -> { host: client|null, clients: Set<client> }
const rooms = new Map();
function getRoom(code) {
  if (!rooms.has(code)) rooms.set(code, { host: null, clients: new Set() });
  return rooms.get(code);
}
function leaveRoom(c) {
  if (!c.room) return;
  const r = rooms.get(c.room);
  if (r) {
    r.clients.delete(c);
    if (r.host === c) r.host = null;
    if (r.clients.size === 0) rooms.delete(c.room);
    else broadcast(r, { kind: 'presence', count: r.clients.size }, c);
  }
  c.room = null;
}
function broadcast(room, obj, except) {
  const frame = encodeText(JSON.stringify(obj));
  for (const c of room.clients) if (c !== except && c.sock.writable) c.sock.write(frame);
}

// ---------- rate limiter (sliding window) ----------
function makeLimiter(max, windowMs) {
  const hits = new Map();
  return key => {
    const t = Date.now();
    const arr = (hits.get(key) || []).filter(x => t - x < windowMs);
    if (arr.length >= max) { hits.set(key, arr); return false; }
    arr.push(t); hits.set(key, arr); return true;
  };
}
const allowMsg = makeLimiter(12, 10000);

// ---------- WebSocket framing (RFC 6455, text frames) ----------
function encodeText(str) {
  const payload = Buffer.from(str, 'utf8');
  const len = payload.length;
  let head;
  if (len < 126) { head = Buffer.from([0x81, len]); }
  else if (len < 65536) { head = Buffer.alloc(4); head[0] = 0x81; head[1] = 126; head.writeUInt16BE(len, 2); }
  else { head = Buffer.alloc(10); head[0] = 0x81; head[1] = 127; head.writeBigUInt64BE(BigInt(len), 2); }
  return Buffer.concat([head, payload]);
}
function makeFrameParser(onText, onClose) {
  let buf = Buffer.alloc(0);
  return chunk => {
    buf = Buffer.concat([buf, chunk]);
    for (;;) {
      if (buf.length < 2) return;
      const op = buf[0] & 0x0f;
      const masked = (buf[1] & 0x80) !== 0;
      let len = buf[1] & 0x7f, off = 2;
      if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); off = 10; }
      const maskOff = off; if (masked) off += 4;
      if (buf.length < off + len) return;
      let payload = buf.slice(off, off + len);
      if (masked) { const mask = buf.slice(maskOff, maskOff + 4); payload = Buffer.from(payload.map((b, i) => b ^ mask[i % 4])); }
      buf = buf.slice(off + len);
      if (op === 0x8) { onClose(); return; }
      if (op === 0x9) continue; // ping → ignore (platforms keep alive)
      if (op === 0x1) onText(payload.toString('utf8'));
    }
  };
}

// ---------- HTTP + upgrade ----------
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    let clients = 0; for (const r of rooms.values()) clients += r.clients.size;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size, clients }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('PremierePop party server is running. Connect with a WebSocket client.\n');
});

server.on('upgrade', (req, sock) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) { sock.destroy(); return; }
  const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');

  const client = { sock, room: null, name: 'Guest', id: crypto.randomBytes(4).toString('hex') };
  const send = obj => { if (sock.writable) sock.write(encodeText(JSON.stringify(obj))); };
  client.send = send;

  sock.on('data', makeFrameParser(text => {
    let msg; try { msg = JSON.parse(text); } catch { return; }
    if (!allowMsg(client.id)) { send({ kind: 'error', reason: 'rate_limited' }); return; }

    if (msg.kind === 'join') {
      const code = String(msg.room || '').toUpperCase();
      if (!/^[A-Z0-9]{6}$/.test(code)) { send({ kind: 'error', reason: 'bad_room' }); return; }
      leaveRoom(client);
      const r = getRoom(code);
      client.room = code; client.name = String(msg.name || 'Guest').slice(0, 24);
      const wasEmpty = r.clients.size === 0;
      r.clients.add(client);
      if (wasEmpty || !r.host) r.host = client;
      send({ kind: 'joined', room: code, isHost: r.host === client, count: r.clients.size });
      broadcast(r, { kind: 'presence', count: r.clients.size, name: client.name }, client);
      return;
    }
    if (!client.room) return;
    const r = rooms.get(client.room); if (!r) return;

    if (msg.kind === 'sync') {
      if (r.host !== client) return; // only the host drives playback
      broadcast(r, { kind: 'sync', event: msg.event, time: msg.time, playing: !!msg.playing, rate: msg.rate, from: client.name }, client);
    } else if (msg.kind === 'danmaku' && msg.item) {
      const t = String(msg.item.text || '').trim();
      if (!t || t.length > MAX_TEXT || badText(t)) { send({ kind: 'error', reason: 'filtered' }); return; }
      broadcast(r, { kind: 'danmaku', item: { text: t, time: Number(msg.item.time) || 0, author: client.name }, from: client.name }, client);
    } else if (msg.kind === 'chat') {
      const t = String(msg.text || '').trim();
      if (!t || t.length > 200 || badText(t)) return;
      broadcast(r, { kind: 'chat', text: t, name: client.name, from: client.name }, client);
    } else if (msg.kind === 'reaction') {
      const e = String(msg.emoji || '').slice(0, 8);
      if (e) broadcast(r, { kind: 'reaction', emoji: e, from: client.name }, client);
    }
  }, () => { leaveRoom(client); try { sock.end(); } catch {} }));

  sock.on('close', () => leaveRoom(client));
  sock.on('error', () => leaveRoom(client));
});

server.listen(PORT, () => console.log('PremierePop server listening on :' + PORT));
