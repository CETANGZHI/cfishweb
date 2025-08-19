self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("Push received:", data);

  const title = data.title || "CFISH Notification";
  const options = {
    body: data.message || "You have a new notification.",
    icon: data.icon || "/favicon.ico",
    badge: data.badge || "/badge.png",
    data: data.url || "/notifications",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || "/notifications")
  );
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim());
});


