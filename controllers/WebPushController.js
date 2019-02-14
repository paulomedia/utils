module.exports = {};
const Boom = require('boom'),
    webpush = require('web-push');

const vapidKeys = {
    "publicKey": "BB8b39ghT3BLJCwv560s3GueEhH3OExR265W6pYMfppPaWkhvtffKdg2ic6Mwr6rTAc0pBNetzkcEnwkVeFm0ZA",
    "privateKey": "jnKa5e3K3QtMqh1C_5JjCTX_Rp0LEO5azqsKsqGN5Fo"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const sendWebPush = function (title, body, subscription) {
    return new Promise((resolve, reject) => {
        const notificationPayload = {
            "notification": {
                "title": title,
                "body": body,
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                }
            }
        };

        webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
            .then(() => {
                resolve();
            })
            .catch(err => {
                console.error("Error sending notification, reason: ", err);
                reject(Boom.badImplementation('Something wrong happen....'));
            });
    });
};

module.exports.sendWebPush = sendWebPush;

