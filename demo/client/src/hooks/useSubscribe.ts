import {useMemo} from "react";

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
    serviceWorkerAndPushManagerNotSupport,
    pushManagerUnavailable,
    existingSubscription,
    unknown
}

interface SubscribeProps {
    publicKey: string;
}

export const useSubscribe = ({ publicKey }: SubscribeProps) => {
    const getSubscribe = async (): Promise<PushSubscription> => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            throw { errorCode: Errors.serviceWorkerAndPushManagerNotSupport };
        }
        const registration = await navigator.serviceWorker.ready;

        if (!registration.pushManager) {
            throw { errorCode: Errors.pushManagerUnavailable };
        }

        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
            throw { errorCode: Errors.existingSubscription };
        }

        const convertedVapidKey = urlBase64ToUint8Array(publicKey);
        return await registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
        });
    };
    return getSubscribe
};
