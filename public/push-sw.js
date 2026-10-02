self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = { body: event.data?.text() || '' }; }
  const title = typeof payload.title === 'string' ? payload.title : 'Livestock Carnival';
  const options = {
    body: typeof payload.body === 'string' ? payload.body : 'There is a new official carnival update.',
    icon: '/assets/branding/carnival-logo-solid.jpeg',
    badge: '/assets/branding/carnival-logo-solid.jpeg',
    data: { url: typeof payload.url === 'string' ? payload.url : '/' },
    tag: typeof payload.tag === 'string' ? payload.tag : 'livestock-carnival-update',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawUrl = event.notification.data?.url || '/';
  const url = new URL(rawUrl, self.location.origin);
  if (url.origin !== self.location.origin) return;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    const existing = clients.find((client) => new URL(client.url).origin === url.origin);
    if (existing) return existing.focus().then(() => existing.navigate(url.href));
    return self.clients.openWindow(url.href);
  }));
});
