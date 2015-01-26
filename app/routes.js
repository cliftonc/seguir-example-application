var seguir = require('./seguir');
var db     = require('../config/database');

module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		db.find({}, function(err, users) {
			res.render('index', {users: users, user: req.user});
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage')});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/my-profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function(req, res) {
		res.render('signup', { message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/my-profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/my-profile', function(req, res) {
		if(!req.isAuthenticated()) {
			res.redirect('/');
		} else {
			res.redirect('/user/' + req.user.displayname);
		}
	});

	app.get('/user/:displayname', function(req, res) {

		var loggedIn = req.isAuthenticated(),
				seguirId = loggedIn ? req.user.seguirId : null,
				userId = loggedIn ? req.user._id.toString() : null;

		getUserByName(req.params.displayname, function(err, profile) {

			seguir.getUserRelationship(seguirId, profile.seguirId, function(err, relationship) {

				seguir.getFeedForUser(seguirId, profile.seguirId, null, 50, function(err, feed) {

					res.render('profile', {
						feed: feed,
						user : req.user,
						profile: profile,
						relationship: relationship,
						userOwnsProfile: profile._id.toString() === userId
					});

				});

			});

		});

	});

};


function getUserByName(displayname, next) {
	db.findOne({ 'displayname' :  displayname }, next);
}
