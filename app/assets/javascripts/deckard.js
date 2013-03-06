(function($) {
  // Add a CSRF token to all AJAX requests
  var csrfToken = $('meta[name=csrf-token]').attr('content');
  jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
    if (!options.crossDomain) {
      xhr.setRequestHeader('X-CSRF-Token', csrfToken);
    }
  });

  window.Deckard = {};

  // === Lists ===
  // Ajax form binding
  var $new_list_input = $('#js-add-list'),
      $list_name = $('#js-list-name'),
      $list = $('.lists ul');

  $new_list_input.on('click', function() {
    var promise = $.ajax({
      url: '/lists.json',
      type: 'POST',
      data: {
        list: { name: $list_name.val() }
      }
    });

    promise.done(function(data) {
      $list.prepend(HandlebarsTemplates['lists/list'](data));
    });

    promise.fail(function(error) {
      console.log(error);
    });

    promise.always(function() {
      $list_name.val('');
    });
  });

  // list item on-click
  $list.on('click', 'li', function() {
    var self = $('a', this)[0];

    if (self && self.href) {
      window.location.href = self.href;
    }
  });

  $list.on('click', 'input', function(evt) {
    evt.stopPropagation();
  });

  // Cool edit ability
  $list.on('click', 'a', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    var currentContent = this.innerHTML,
        replacementInput = '<input type="text" data-update-location="' + this.href + '"/>';

    $(this).replaceWith(replacementInput);
    $('input[data-update-location="' + this.href + '"]').focus().val(currentContent);
  });

  $list.on('blur', 'input', function(evt) {
    var name = this.value,
        $self = $(this);

    if (!$self.hasClass('pending')) {
      $self.addClass('pending');

      var promise = $.ajax({
        url: $self.data('update-location') + '.json',
        type: 'POST',
        data: {
          _method: 'put',
          list: { name: $self.val() }
        }
      });

      promise.done(function(data) {
        $self.replaceWith('<a href="/lists/' + data.id + '">' + data.name + '</a>');
      });

      promise.fail(function(error) {
        console.log(error);
      });
    }
  });
  
})(jQuery);
