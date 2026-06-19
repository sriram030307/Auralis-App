// Auralis Safety Guardian — Service Worker
// Enables background operation, push notifications, and persistent monitoring

const CACHE_NAME = "auralis-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

// Handle push notifications from server
self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "🚨 Auralis Emergency", {
      body: data.body || "Emergency alert triggered.",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      vibrate: [300, 100, 300, 100, 300],
      requireInteraction: true,
      tag: "auralis-emergency",
      data: { url: data.url || "/" },
      actions: [
        { action: "open", title: "Open App" },
        { action: "call", title: "Call 112" },
      ],
    })
  );
});

// Handle notification click
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "call") {
    clients.openWindow("tel:112");
    return;
  }
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window" }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      clients.openWindow(url);
    })
  );
});

// Background sync — keep engine alive
self.addEventListener("message", (e) => {
  if (e.data?.type === "AURALIS_EMERGENCY") {
    self.registration.showNotification("🚨 Auralis: EMERGENCY ALERT", {
      body: e.data.message || "Emergency detected! Check on this person immediately.",
      icon: "/favicon.ico",
      vibrate: [500, 200, 500, 200, 500],
      requireInteraction: true,
      tag: "auralis-emergency",
      data: { url: "/emergency-alert" },
      actions: [
        { action: "open", title: "Open Auralis" },
        { action: "call", title: "Call Emergency" },
      ],
    });
  }

  if (e.data?.type === "AURALIS_ALERT") {
    self.registration.showNotification("⚠️ Auralis Safety Alert", {
      body: e.data.message || "Safety alert detected.",
      icon: "/favicon.ico",
      vibrate: [300, 100, 300],
      requireInteraction: false,
      tag: "auralis-alert",
      data: { url: "/" },
    });
  }
});
