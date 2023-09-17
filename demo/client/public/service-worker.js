self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'no payload',
        // icon: 'icons/icon-72x72.png',
        vibrate: [100, 50, 100],
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
