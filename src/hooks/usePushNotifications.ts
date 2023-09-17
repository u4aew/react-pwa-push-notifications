import { useEffect } from 'react';

export function usePushNotifications() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then((registration) => {
                    console.log('Service Worker Registered', registration);
                    subscribeUserToPush(registration);
                })
                .catch((error) => {
                    console.log('Registration failed: ', error);
                });
        }
    }, []);

    const subscribeUserToPush = (registration) => {
        if (!registration.pushManager) {
            console.log('Push manager unavailable.');
            return;
        }

        registration.pushManager.getSubscription()
            .then((existingSubscription) => {
                if (existingSubscription) {
                    console.log('Already subscribed', existingSubscription);
                } else {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
                    })
                        .then((newSubscription) => {
                            console.log('Subscribed', newSubscription);
                        });
                }
            })
            .catch((error) => {
                console.log('Subscription error: ', error);
            });
    };

    return null;
}
