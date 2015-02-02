
$(function() {

  $('.follow').click(function(e) {
    var data = {
      user: $(this).data('user')
    }
    post('/social/follow', data, function() {
      window.top.location=window.top.location;
    });
  });

  $('.unfriend').click(function(e) {
    var user = $(this).data('user');
    $.ajax({
      type:'delete',
      url:'/social/friend/' + user,
      success:function() {
        // Cheat and just reload for now
        window.top.location=window.top.location;
      },
      fail: function(request, err, message) {
        if(message == 'Forbidden') {
          document.location = '/login?returnUrl=' + document.location.pathname;
        }
      }
    });
  });

  $('.unfollow').click(function(e) {
    var user = $(this).data('user');
    $.ajax({
      type:'delete',
      url:'/social/follow/' + user,
      success:function() {
        // Cheat and just reload for now
        window.top.location=window.top.location;
      },
      fail: function(request, err, message) {
        if(message == 'Forbidden') {
          document.location = '/login?returnUrl=' + document.location.pathname;
        }
      }
    });
  });

  $('#friendModal').on('show.bs.modal', function(event) {
      var button = $(event.relatedTarget)
      var user = button.data('user')
      var modal = $(this)
      modal.find('input.friend-request-user').val(user);
  });

  $('.friend-request').click(function(e) {

    var data = {
      user: $('#friendModal input.friend-request-user').val(),
      message: $('#friendModal textarea.friend-request-message').val() || ''
    }

    post('/social/friend', data, function() {
      // Cheat and just reload for now
      window.top.location=window.top.location;
    });

  });

  $('.accept-friend-request').click(function(e) {

    var data = {
      friend_request: $(this).data('friend-request')
    }
    post('/social/friend/accept', data, function() {
      // Cheat and just reload for now
      window.top.location=window.top.location;
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

