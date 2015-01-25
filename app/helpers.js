var moment = require('moment');

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
  }
};



