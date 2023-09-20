import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import {useSubscribe} from "./hooks/useSubscribe";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [fingerprint, setFingerprint] = useState<string>('')
    const [idSubscribe, setIdSubscribe] = useState('')
    const [message, setMessage] = useState('')
    const [title, setTitle] = useState('')

    const {onSubscribe} = useSubscribe()

    const onSubmitSubscribe = (e: any) => {
        e.preventDefault()
        onSubscribe(fingerprint)
        toast('🦄 Wow so easy!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const onSubmitPush = (e: any) => {
        e.preventDefault()
        fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: idSubscribe,
                message: message,
                title: title
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
    }

    const onChangeFingerprint = useCallback((e: any) => {
        const {value} = e.target
        setFingerprint(value)
    }, [])

    const onChangeTitle = (e: any) => {
        const {value} = e.target
        setTitle(value)
    }

    const onChangeMessage = (e: any) => {
        const {value} = e.target
        setMessage(value)
    }

    const onChangeId = (e: any) => {
        const {value} = e.target
        setIdSubscribe(value)
    }


    useEffect(() => {
        const promise = FingerprintJS.load()
        promise.then(fp => fp.get())
            .then(result => {
                const visitorId = result.visitorId
                setFingerprint(visitorId)
            })
    }, [])


    return (
        <div className="App">
            <main>
                <div className="send">
                    <div>
                        <form onSubmit={onSubmitPush} action="">
                            <div className="field">
                                <input id="idSubscribe" placeholder="id" name="idSubscribe" value={idSubscribe}
                                       onChange={onChangeId} required type="text"/>
                            </div>
                            <div className="field">
                                <input id="title" placeholder="title" name="title" value={title} onChange={onChangeTitle} required
                                       type="text"/>
                            </div>
                            <div className="field">
                                <input id="message"  placeholder="message" name="message" value={message} onChange={onChangeMessage} required
                                       type="text"/>
                            </div>
                            <button type="submit">Push</button>
                        </form>
                    </div>
                </div>
                <div className="section">
                    <form onSubmit={onSubmitSubscribe} action="">
                        <div className="title">Your Id</div>
                        <div className="field">
                            <input placeholder="Your id" type="text" name="fingerprint" required value={fingerprint}
                                   onChange={onChangeFingerprint}/>
                        </div>
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </main>
            <ToastContainer position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
            />
        </div>
    );
}

export default App;
