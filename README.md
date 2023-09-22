# React hook Push Notifications

## Overview

This package provides a custom React hook for facilitating push subscriptions in your application. It ensures proper handling of browser APIs and returns easy-to-handle errors in case of issues.

## Installation

```bash
npm install react-pwa-push-notifications
```

or

```bash
yarn add react-pwa-push-notifications
```

## Usage

First, import the hook:

```typescript
import { useSubscribe, Errors } from 'react-pwa-push-notifications';
```

Then, initialize it with your public VAPID key:

```typescript
const { getSubscription } = useSubscribe({ publicKey: 'YOUR_PUBLIC_KEY_HERE' });
```

Use `getSubscription` to initiate the push subscription:

```typescript
const subscribeUser = async () => {
  try {
    const subscription = await getSubscription();
    // Handle the new subscription object
  } catch (error) {
    if (error.errorCode === Errors.ServiceWorkerAndPushManagerNotSupported) {
      // Handle service worker or push manager not being supported
    } else if (error.errorCode === Errors.PushManagerUnavailable) {
      // Handle PushManager unavailable
    } else if (error.errorCode === Errors.ExistingSubscription) {
      // Handle existing subscription
    } else {
      // Handle other errors
    }
  }
};
```

## Error Handling

The hook provides an `Errors` enum for better error management. It includes the following error codes:

- `ServiceWorkerAndPushManagerNotSupported`: The service worker or push manager is not supported by the browser.
- `PushManagerUnavailable`: The PushManager is unavailable.
- `ExistingSubscription`: An existing subscription is already present.
- `Unknown`: An unknown error has occurred.

## Contributing

Feel free to open issues or pull requests if you want to improve this package.

## License

MIT

---

This README provides an example usage and can be expanded based on additional features or requirements.
