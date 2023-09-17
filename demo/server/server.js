const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const publicKey = 'BDZJSiMXSJUhryPkjFh_H84ZeEjVNfq5STCXVDEW4bpXye1mybGCjufRFIVmMxJN1wHOGUunGyBra0qvSa0fGJ8';
const privateKey = 'upQsMoPu4_T6aT3a8Nwg8b7Cd3wNjQwfD5PgCYJjTmc';

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    publicKey,
    privateKey
);

// Хранилище для подписок
const subscriptions = [];

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    console.log(JSON.stringify(subscription), 'subscription')

    subscriptions.push(subscription); // сохраняем подписку
    return res.status(201).json({data: {success: true}});
});

setInterval(() => {
    const payload = JSON.stringify({ title: 'Periodic Web Push' });
    subscriptions.forEach(subscription => {
        console.log('push start')
        webPush.sendNotification(subscription, payload).catch(error => {
            console.log('push error')
            console.error(error.stack);
        }).then((value) => {
            console.log(value, 'value')
            console.log('success')
        });
    });
}, 1 * 10 * 1000);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
