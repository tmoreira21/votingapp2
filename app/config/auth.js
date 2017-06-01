'use strict';

module.exports = {
    'twitterAuth': {
        'consumerKey': process.env.TWITTER_KEY,
        'consumerSecret': process.env.TWITTER_SECRET,
        'callbackURL': process.env.TWITTER_CALLBACK_URL
    },
    'facebookAuth': {
        'clientID': process.env.FACEBOOK_KEY,
        'clientSecret': process.env.FACEBOOK_SECRET,
        'callbackURL': process.env.FACEBOOK_CALLBACK_URL
    }
};