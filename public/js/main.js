
$(function() {

  $('.follow').click(function(e) {
    var data = {
      user: $(this).data('user')
    }
    post('/social/follow', data, function() {
      $('.follow').prop('value','Un-follow');
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
      console.log('Now a friend???');
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

