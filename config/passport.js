var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var userController = require('../controllers/userController')(User);
var configAuth = require('./oauth');



module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebook.clientID,
            clientSecret    : configAuth.facebook.clientSecret,
            callbackURL     : configAuth.facebook.callbackURL,
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },

        // facebook will send back the token and profile
        function(req, token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // check if the user is already logged in
                if (!req.user) {

                    // find the user in the database based on their facebook id
                    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that facebook id, create them
                            var newUser            = new User();
                            // set all of the facebook information in our user model
                            newUser.facebook.id    = profile.id; // set the users facebook id
                            newUser.facebook.token = token; // we will save the token that facebook provides to the user
                            newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
                            if(profile.email)
                                newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                            newUser.twitter.id          = [];
                            newUser.twitter.token       = [];
                            newUser.twitter.username    = [];
                            newUser.twitter.displayName = [];
                            // save our user to the database
                            newUser.save(function(err) {
                                if (err)
                                    throw err;

                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        }

                    });

                } else {

                    var user            = User(req.user); // pull the user out of the session
                    // console.log(user)
                    // update the current users facebook credentials
                    user.facebook.id    = profile.id;
                    user.facebook.token = token;
                    user.facebook.name  = profile.displayName;

                    if(profile.email)
                        user.facebook.email = profile.emails[0].value;

                    // console.log(user)
                    // save the user
                    user.isNew = false;
                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });

                }

            });

        }));

    passport.use(new TwitterStrategy({

            consumerKey     : configAuth.twitter.consumerKey,
            consumerSecret  : configAuth.twitter.consumerSecret,
            callbackURL     : configAuth.twitter.callbackURL,
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function(req, token, tokenSecret, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser                 = new User();

                            newUser.twitter.id          = profile.id;
                            newUser.twitter.token       = token;
                            newUser.twitter.username    = profile.username;
                            newUser.twitter.displayName = profile.displayName;
                            newUser.twitter.tokenSecret = tokenSecret;
                            newUser.facebook.id    = [];
                            newUser.facebook.token = [];
                            newUser.facebook.name  =  [];
                            newUser.facebook.email =  [];
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user                 = User(req.user); // pull the user out of the session

                    user.twitter.id          = profile.id;
                    user.twitter.token       = token;
                    user.twitter.tokenSecret = tokenSecret;
                    user.twitter.username    = profile.username;
                    user.twitter.displayName = profile.displayName;

                    user.isNew = false;
                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }

            });

        }));
};