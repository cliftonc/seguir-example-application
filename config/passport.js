// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var db               = require('./database');
var seguir           = require('../app/seguir');
var bcrypt   = require('bcrypt-nodejs');


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        db.findOne({_id:id}, function(err, user) {
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

            db.findOne({ 'email' :  email }, function(err, user) {

                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!validPassword(password, user.password))
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

                db.findOne({ 'email' :  email }, function(err, user) {

                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        var newUser             = {};

                        newUser.email           = email;
                        newUser.password        = generateHash(password);
                        newUser.displayname     = req.body.displayname;

                        // add the user to seguir
                        seguir.addUser(null, newUser.displayname, {email:newUser.email}, function(err, seguirUser) {

                            if(err)
                                return done(err);

                            newUser.seguirId = seguirUser.user;

                            db.insert(newUser, function (err, newDoc) {

                                console.dir(newDoc);

                                if (err)
                                    return done(err);

                                return done(null, newDoc);
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

// generating a hash
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
function validPassword(password, userPassword) {
    return bcrypt.compareSync(password, userPassword);
};
