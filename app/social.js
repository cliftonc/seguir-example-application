var seguir = require('./seguir');

module.exports = function(app) {

  app.post('/social/post', isLoggedIn, function(req, res) {
    seguir.addPost(req.user.seguirId, req.body.content, Date.now(), req.body.isprivate, function(err, post) {
      res.redirect(req.body.returnUrl);
    })
  });

  app.post('/social/friend', isLoggedInApi, function(req, res) {
    seguir.addFriendRequest(req.user.seguirId, req.body.user, req.body.message, Date.now(), function(err, friend) {
      res.send(friend);
    });
  });

  app.del('/social/friend/:user', isLoggedInApi, function(req, res) {
    seguir.removeFriend(req.user.seguirId, req.params.user, function(err, result) {
      res.send(result);
    });
  });

  app.post('/social/friend/accept', isLoggedInApi, function(req, res) {
    seguir.acceptFriendRequest(req.user.seguirId, req.body.friend_request, function(err, friend_request) {
      res.send(friend_request);
    });
  });

  app.post('/social/follow', isLoggedInApi, function(req, res) {
    seguir.followUser(req.user.seguirId, req.body.user, Date.now(), function(err, follow) {
      res.send(follow);
    })
  });

  app.del('/social/follow/:user', isLoggedInApi, function(req, res) {
    seguir.removeFollower(req.user.seguirId, req.params.user, function(err, result) {
      res.send(result);
    });
  });

};

// route middleware to ensure user is logged in - must be logged in to use API
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login?returnUrl=' + req.body.returnUrl);
  }
  next();
}

function isLoggedInApi(req, res, next) {
  if (!req.isAuthenticated()) {
    res.writeHead(403);
    return res.end("Not logged in!");
  }
  next();
}
