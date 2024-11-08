import { useSubscribe, Errors } from './useSubscribe';

describe('useSubscribe', () => {
  let serviceWorkerMock;
  let pushManagerMock;

  beforeEach(() => {
    pushManagerMock = {
      getSubscription: jest.fn().mockResolvedValue(null),
      subscribe: jest.fn().mockResolvedValue({}),
    };

    serviceWorkerMock = {
      ready: Promise.resolve({
        pushManager: pushManagerMock,
      }),
    };

    Object.defineProperty(navigator, 'serviceWorker', {
      value: serviceWorkerMock,
      writable: true,
    });

    Object.defineProperty(window, 'PushManager', {
      value: {},
      writable: true,
    });
  });

  it('should throw an error if push manager is unavailable', async () => {
    serviceWorkerMock.ready = Promise.resolve({
      pushManager: null,
    });

    const { getSubscription } = useSubscribe({ publicKey: 'test' });

    await expect(getSubscription()).rejects.toEqual({
      errorCode: Errors.PushManagerUnavailable,
    });
  });

  it('should throw an error if there is an existing subscription', async () => {
    pushManagerMock.getSubscription = jest.fn().mockResolvedValue({});

    const { getSubscription } = useSubscribe({ publicKey: 'test' });

    await expect(getSubscription()).rejects.toEqual({
      errorCode: Errors.ExistingSubscription,
    });
  });

  it('should subscribe successfully if no errors occur', async () => {
    const mockSubscribe = jest.fn().mockResolvedValue({});
    pushManagerMock.subscribe = mockSubscribe;

    const { getSubscription } = useSubscribe({ publicKey: 'test' });

    await expect(getSubscription()).resolves.toEqual({});
    expect(mockSubscribe).toHaveBeenCalled();
  });
});
