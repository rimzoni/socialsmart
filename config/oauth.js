var ids = {
    facebook: {
        clientID      : 'FACEBOOK_APP_TOKEN',
        clientSecret  : 'FACEBOOK_APP_SECRET',
        callbackURL   : 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        consumerKey      : 'TWITTER_APP_TOKEN',
        consumerSecret   : 'TWITTER_APP_SECRET',
        callbackURL      : 'http://localhost:3000/auth/twitter/callback'
    }
};

module.exports = ids;