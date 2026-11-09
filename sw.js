/* Kioku service worker. Built by web/site.py: the version changes whenever any shipped file does. */
const VERSION = "f72731ec19", CACHE = "kioku-" + VERSION, RUNTIME = "kioku-runtime";
const SHELL = ["./", "assets/app.aac7d47940.css", "assets/app.94abed0b66.js", "manifest.webmanifest", "favicon.png", "icon-192.png", "apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())) });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("kioku-") && k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
const put = (name, req, res) => { if (res && (res.ok || res.type === "opaque")) caches.open(name).then((c) => c.put(req, res.clone())); return res };
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url), same = url.origin === location.origin;
  // the page itself and the user's Firebase settings: newest when online, the saved copy when not
  if (same && (req.mode === "navigate" || url.pathname.endsWith("/firebase-config.js"))) {
    const key = req.mode === "navigate" ? "./" : req;
    e.respondWith(fetch(req).then((res) => put(req.mode === "navigate" ? CACHE : RUNTIME, key, res)).catch(() => caches.match(key).then((r) => r || caches.match("./")))); return;
  }
  // hashed app files and icons never change: saved copy first
  if (same) { e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => put(CACHE, req, res)))); return }
  // fonts and the Firebase SDK: saved copy at once, refreshed in the background
  if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || (url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/"))) {
    e.respondWith(caches.match(req).then((r) => { const net = fetch(req).then((res) => put(RUNTIME, req, res)).catch(() => r); return r || net })); return;
  }
  // everything else (sign-in, saving to your account) goes straight to the network
});
