const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const publicKey = 'BL-_niVS6QMIuOuykFhNAJtnuaOmuYfoGYjFwrGAg4z1m3WRVXmB-LdRobGnW3kEkWBXzCEBOKe2dZS5b90IeqQ';
const privateKey = 'wXhxwMlrzDFQiPvB_R3CzZiALUHdtcgekobHPT92rrA';

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    publicKey,
    privateKey
);

// Хранилище для подписок
const subscriptions = [];

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription); // сохраняем подписку
    res.status(201).json({});

    // Отправляем первое уведомление сразу после подписки
    const payload = JSON.stringify({ title: 'Web Push Test' });
    webPush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
    });
});

// Отправка уведомлений каждые 5 минут
setInterval(() => {
    const payload = JSON.stringify({ title: 'Periodic Web Push' });
    console.log('test')
    subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, payload).catch(error => {
            console.error(error.stack);
        });
    });
}, 1 * 60 * 1000); // 5 минут в миллисекундах

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
