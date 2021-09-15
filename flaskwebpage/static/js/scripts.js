$(function() {

    $('#go').click(function() {
      $('#go').addClass('is-loading');
      $.ajax({
        url: '/do_something',
        type: 'POST',
        success: function(response) {
          $('#results').html(response);
          $('#go').removeClass('is-loading');
        }
      });
    });
  
  });