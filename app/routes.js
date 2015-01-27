var seguir = require('./seguir');
var db     = require('../config/database');
var async  = require('async');

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

		function getProfile(next) {
			 getUserByName(req.params.displayname, next);
		}

		function getUserRelationship(profile) {
			 return function(next) {
			 	 if(!seguirId) return next();
			 	 seguir.getUserRelationship(seguirId, profile.seguirId, next);
			 }
		}

		function getFeed(profile) {
			return function(next) {
			   seguir.getFeedForUser(seguirId, profile.seguirId, null, 50, function(err, feed) {
			   		console.dir(err);
			   		next(null, feed);
			   });
			 }
		}

		function getFriendRequests(profile) {
			return function(next) {
				if(seguirId !== profile.seguirId) return next();
				seguir.getFriendRequests(seguirId, next);
			}
		}

		getProfile(function(err, profile) {
			async.parallel({
				relationship: getUserRelationship(profile),
				feed: getFeed(profile),
				friendRequests: getFriendRequests(profile)
			}, function(err, result) {
					var isUserProfile = profile._id.toString() === userId;
					var viewData = {
						feed: result.feed,
						user : req.user,
						profile: profile,
						relationship: result.relationship,
						userOwnsProfile: isUserProfile,
						friendRequests: isUserProfile ? result.friendRequests : null
					};
					res.render('profile', viewData);
			});
		});

	});

};


function getUserByName(displayname, next) {
	db.findOne({ 'displayname' :  displayname }, next);
}
