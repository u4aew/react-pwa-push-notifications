const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};

export enum Errors {
    ServiceWorkerAndPushManagerNotSupported = "ServiceWorkerAndPushManagerNotSupported",
    PushManagerUnavailable = "PushManagerUnavailable",
    ExistingSubscription = "ExistingSubscription",
    Unknown = "Unknown"
}

interface SubscribeProps {
    publicKey: string;
}

interface ErrorObject {
    errorCode: Errors;
}

export const useSubscribe = ({ publicKey }: SubscribeProps) => {
    const getSubscription = async (): Promise<PushSubscription> => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            throw { errorCode: Errors.ServiceWorkerAndPushManagerNotSupported } as ErrorObject;
        }

        const registration = await navigator.serviceWorker.ready;

        if (!registration.pushManager) {
            throw { errorCode: Errors.PushManagerUnavailable } as ErrorObject;
        }

        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
            throw { errorCode: Errors.ExistingSubscription } as ErrorObject;
        }

        const convertedVapidKey = urlBase64ToUint8Array(publicKey);
        return await registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
        });
    };

    return {getSubscription};
};
