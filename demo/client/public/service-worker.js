self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.message,
        icon: 'icons/icon-72x72.png',
        vibrate: [100, 50, 100],
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
