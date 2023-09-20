import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {useSubscribe} from "./hooks/useSubscribe";
import toast, {Toaster} from 'react-hot-toast';
import TextInput from "./components/Input";
import axios from "axios";
import { QRCode, QRSvg } from 'sexy-qr';

// in PROD use from .env
const PUBLIC_KEY = 'BDZJSiMXSJUhryPkjFh_H84ZeEjVNfq5STCXVDEW4bpXye1mybGCjufRFIVmMxJN1wHOGUunGyBra0qvSa0fGJ8';

function App() {
    const [loadingSubscribe, setLoadingSubscribe] = useState<boolean>(false)
    const [loadingPush, setLoadingPush] = useState<boolean>(false)
    const [pushId, setPushId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [subscribeId, setSubscribeId] = useState<string>('');
    const [showSubscribe, setShowSubscribe] = useState<boolean>(true)

    const onShowSubscribe = () => {
        setShowSubscribe(true)
    }
    const onShowPush = () => {
        setShowSubscribe(false)
    }


    const qrCode = useMemo(() => {
        const qr =  new QRCode({
            content: window.location.href,
            ecl: 'M'
        });
        return new QRSvg(qr, {
            fill: '#182026',
            cornerBlocksAsCircles: true,
            size: 200, // px
            radiusFactor: 0.75, // 0-1
            cornerBlockRadiusFactor: 2, // 0-3
            roundOuterCorners: true,
            roundInnerCorners: true,
            preContent: '<!-- QR Code -->',
        }).svg
    }, [])

    const getSubscribe = useSubscribe({publicKey: PUBLIC_KEY});

    const onSubmitSubscribe = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingSubscribe(true)
        try {
            const subscription = await getSubscribe();
            await axios.post('/api/subscribe', {
                subscription: subscription,
                id: subscribeId
            })
            toast.success('Subscribe success');
        } catch (e) {
            console.warn(e);
            toast.error('Details console');
        } finally {
            setLoadingSubscribe(false)
        }
    }, [getSubscribe]);

    const onSubmitPush = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPush(true)
        try {
            await axios.post('/api/send', {
                message,
                title,
                id: pushId
            })
            toast.success('Push success');
        } catch (e) {
            toast.error('Details console');
        } finally {
            setLoadingPush(false)
        }
    }, [pushId, message, title]);

    const onChange = useCallback((setState: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value);
    }, []);

    useEffect(() => {
        FingerprintJS.load()
            .then(fp => fp.get())
            .then(result => setSubscribeId(result.visitorId));
    }, []);


    return (
        <div className="App">
            <main>
                <div>
                    <div className="message">
                        <div className="title"> Use as PWA</div>
                        <div>
                            You need to install the site on your home screen.
                            Subscribe to push notifications.
                            Then you can test sending notifications.
                        </div>
                    </div>
                    <div className={'qrCode'} dangerouslySetInnerHTML={{ __html: qrCode }} />
                </div>
                <div className="tabs">
                    <div className={`tab-item`}>
                        <button className={`tab ${showSubscribe ? 'active' : ''}`} onClick={onShowSubscribe}>Subscribe</button>
                    </div>
                    <div className={`tab-item`}>
                        <button className={`tab ${!showSubscribe ? 'active' : ''}`} onClick={onShowPush}>Push</button>
                    </div>
                </div>
                {!showSubscribe && <div className="send">
                    <form onSubmit={onSubmitPush}>
                        <div className="title">Notification</div>
                        <TextInput id="idSubscribe" placeholder="id" value={pushId}
                                   onChange={onChange(setPushId)}/>
                        <TextInput id="title" placeholder="title" value={title} onChange={onChange(setTitle)}/>
                        <TextInput id="message" placeholder="message" value={message} onChange={onChange(setMessage)}/>
                        <button className={loadingPush ? 'loading' : ''}  type="submit">Send</button>
                    </form>
                </div>}
                {showSubscribe &&  <div className="send">
                    <form onSubmit={onSubmitSubscribe}>
                        <div className="title">Your Id</div>
                        <TextInput id="fingerprint" placeholder="Your id" value={subscribeId}
                                   onChange={onChange(setSubscribeId)}/>
                        <button className={loadingSubscribe ? 'loading' : ''} type="submit">Send</button>
                    </form>
                </div> }

            </main>
            <Toaster/>
        </div>
    );
}

export default App;
