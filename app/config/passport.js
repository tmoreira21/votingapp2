'use strict';

// load twitter passport
//var TwitterStrategy = require('passport-twitter').Strategy;
// load facebook passport
var FacebookStrategy = require('passport-facebook').Strategy;

// load user model
var User = require('../models/users');

//load auth configuration variables
var configAuth = require('./auth');


module.exports = function (passport) {

    // used to serialize the user for the session - always needed when using passport
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

    // used to deserialize the user - always needed when using passport
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	// Twitter Login Strategy
	/*passport.use(new TwitterStrategy({
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL},
        function (token, refreshToken, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {
                // find user
                User.findOne({ 'twitter.id': profile.id }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    // if the user is found then log in
                    if (user) {
                        return done(null, user);
                    } else {
                        // else create user on DB and login
                        var newUser = new User();
    
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;
    
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        })
    );*/
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL},
        function (token, refreshToken, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {
                // find user
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    // if the user is found then log in
                    if (user) {
                        return done(null, user);
                    } else {
                        // else create user on DB and login
                        var newUser = new User();
    
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.displayName;
                        newUser.facebook.provider = profile.provider;

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        })
    );
};