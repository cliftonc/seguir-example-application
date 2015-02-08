var moment = require('moment');
var mention = new RegExp('@[a-zA-Z0-9]+','g');
var _ = require('lodash');

module.exports = {
  if:function(conditional, options) {
    if(conditional) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  humanize: function(date) {
    return moment(date).fromNow();
  },
  mention: function(content) {
    var users = content.match(mention);
    if(users && users.length) {
      users.forEach(function(user) {
        content = content.replace(user, '<a href="/user/' + user.replace('@','') + '">' + user + '</a>');
      });
    }
    return content;
  }
};



