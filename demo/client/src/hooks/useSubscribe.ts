function urlBase64ToUint8Array(base64String: string | any[]) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function useSubscribe () {
    const onSubscribe = (fingerprint: any) => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then((registration) => {
                if (!registration.pushManager) {
                    console.log('Push manager unavailable.');
                    return;
                }

                registration.pushManager.getSubscription().then((existingSubscription) => {
                    if (existingSubscription) {
                        console.log('Got existing subscription', existingSubscription);
                        return;
                    }

                    const publicKey = 'BDZJSiMXSJUhryPkjFh_H84ZeEjVNfq5STCXVDEW4bpXye1mybGCjufRFIVmMxJN1wHOGUunGyBra0qvSa0fGJ8';
                    const convertedVapidKey = urlBase64ToUint8Array(publicKey);

                    registration.pushManager.subscribe({
                        applicationServerKey: convertedVapidKey,
                        userVisibleOnly: true,
                    }).then((newSubscription) => {
                        console.log('New subscription', newSubscription);

                        fetch('/api/subscribe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: fingerprint,
                                subscription: newSubscription
                            }),
                        }).then((response) => {
                            if (!response.ok) {
                                throw new Error('Bad status code from server.');
                            }
                            return response.json();
                        }).then((responseData) => {
                            if (!(responseData.data && responseData.data.success)) {
                                throw new Error('Bad response from server.');
                            }
                        });
                    });
                });
            });
        }
    };

    return {onSubscribe}
}
