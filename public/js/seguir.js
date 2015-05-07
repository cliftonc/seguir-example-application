$(function() {

  $('.js-seguir-follow').click(function(e) {
    var data = {
      user: $(this).data('user')
    }
    post('/social/follow', data, function() {
      window.top.location=window.top.location;
    });
  });

  $('.js-seguir-unfriend').click(function(e) {
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

  $('.js-seguir-unfollow').click(function(e) {
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

  $('#js-seguir-friendModal').on('show.bs.modal', function(event) {
      var button = $(event.relatedTarget)
      var user = button.data('user')
      var modal = $(this)
      modal.find('input.js-seguir-friend-request-user').val(user);
  });

  $('.js-seguir-friend-request').click(function(e) {
    var data = {
      user: $('#js-seguir-friendModal input.js-seguir-friend-request-user').val(),
      message: $('#js-seguir-friendModal textarea.js-seguir-friend-request-message').val() || ''
    }
    post('/social/friend', data, function() {
      // Cheat and just reload for now
      window.top.location=window.top.location;
    });
  });

  $('.js-seguir-accept-friend-request').click(function(e) {
    var data = {
      friend_request: $(this).data('friend-request')
    }
    post('/social/friend/accept', data, function() {
      // Cheat and just reload for now
      window.top.location=window.top.location;
    });
  });

  $('.js-seguir-post').click(function(e) {
    e.preventDefault();
    var data = {
      content: $('.js-seguir-post-content').val() || '',
      isprivate: $('.js-seguir-post-isprivate').is(':checked'),
      ispersonal: $('.js-seguir-post-ispersonal').is(':checked')
    }
    post('/social/post', data, function() {
      // Cheat and just reload for now
      window.top.location=window.top.location;
    });
  });

  $('.js-seguir-delete-post').click(function(e) {
    var post = $(this).data('post');
    $.ajax({
      type:'delete',
      url:'/social/post/' + post,
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

  function post(url, data, success) {
    $.post(url, data, success).fail(function(request, err, message) {
      if(message == 'Forbidden') {
        document.location = '/login?returnUrl=' + document.location.pathname;
      }
    });
  }

});

