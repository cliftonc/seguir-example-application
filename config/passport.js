// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var User             = require('../app/models/user');
var seguir           = require('../app/seguir');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase();

        process.nextTick(function() {

            User.findOne({ 'email' :  email }, function(err, user) {

                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                else
                    return done(null, user);

            });
        });

    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        if (email)
            email = email.toLowerCase();

        if(!email || !password || !req.body.displayname)
            return done(null, false, req.flash('signupMessage', 'You must provide email, name and password!'));

        // asynchronous
        process.nextTick(function() {

            if (!req.user) {

                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        var newUser            = new User();

                        newUser.email           = email;
                        newUser.password        = newUser.generateHash(password);
                        newUser.displayname     = req.body.displayname;

                        // add the user to seguir
                        seguir.addUser(null, newUser.displayname, function(err, seguirUser) {

                            if(err)
                                return done(err);

                            newUser.seguirId = seguirUser.user;

                            newUser.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });

                        });

                    }

                });

            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));

};
