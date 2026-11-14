// Service worker minimo: serve solo a mostrare gli avvisi dei passaggi (niente cache).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const win = list.find(c => new URL(c.url).pathname.startsWith(new URL(self.registration.scope).pathname));
    if (win) return win.focus();
    return self.clients.openWindow(self.registration.scope);
  })());
});
