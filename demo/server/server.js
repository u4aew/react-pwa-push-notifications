const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// DO NOT USE IN PROD
const publicKey = 'BDZJSiMXSJUhryPkjFh_H84ZeEjVNfq5STCXVDEW4bpXye1mybGCjufRFIVmMxJN1wHOGUunGyBra0qvSa0fGJ8';
const privateKey = 'upQsMoPu4_T6aT3a8Nwg8b7Cd3wNjQwfD5PgCYJjTmc';
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    publicKey,
    privateKey
);

// Хранилище для подписок
const subscriptions = {};

app.post('/subscribe', (req, res) => {
    const {subscription, id} = req.body;
    subscriptions[id] = subscription;
    return res.status(201).json({data: {success: true}});
});

app.post('/send', (req, res) => {
    const {message, title, id} = req.body;
    const subscription = subscriptions[id]
    const payload = JSON.stringify({ title, message });
    webPush.sendNotification(subscription, payload).catch(error => {
        return res.status(400).json({data: {success: false}});
    }).then((value) => {
        return res.status(201).json({data: {success: true}});
    });
});

app.get('/info', (req, res) => {
    return res.status(200).json({data: JSON.stringify(subscriptions)});
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
