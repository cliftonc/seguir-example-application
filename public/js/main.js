
$(function() {

  $('.follow').click(function(e) {
    var data = {
      user: $(this).data('user')
    }
    post('/social/follow', data, function() {
      $('.follow').prop('value','Un-follow');
    });
  });

  $('.friend').click(function(e) {
    var data = {
      user: $(this).data('user')
    }
    post('/social/friend', data, function() {
      $('.friend').prop('value','Un-friend');
    });
  });

  function post(url, data, success) {
    $.post(url, data, success).fail(function(request, err, message) {
      if(message == 'Forbidden') {
        document.location = '/login?returnUrl=' + document.location.pathname;
      }
    });
  }

});

