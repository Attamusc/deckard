define(['jquery'], function($) {
  return function() {
    // === Lists ===
    var $new_list_btn = $('#js-add-list'),
        $new_list_name = $('#js-new-list-name'),
        $list = $('.lists ul');

    // Ajax form binding
    $new_list_btn.on('click', function() {
      var promise = $.ajax({
        url: '/lists.json',
        type: 'POST',
        data: {
          list: { name: $new_list_name.val() }
        }
      });

      promise.done(function(data) {
        $list.prepend(HandlebarsTemplates['lists/list'](data));
      });

      promise.fail(function(error) {
        console.log(error);
      });

      promise.always(function() {
        $new_list_name.val('');
      });
    });

    // Cool edit ability
    $list.on('click', 'span.list-name', function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      var currentContent = this.innerHTML,
          parent = this.parentNode,
          update_location = parent.href
          replacementInput = '<input type="text" data-update-location="' + update_location + '"/>';

      $(this).replaceWith(replacementInput);
      $('input[data-update-location="' + update_location + '"]').focus().val(currentContent);

      $(parent).on('click', function(e) { e.preventDefault(); });
    });

    $list.on('click', 'input', function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
    });

    $list.on('blur', 'input', function(evt) {
      var name = this.value,
          parent = this.parentNode,
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
          $self.replaceWith('<span class="list-name">' + data.name + '</span>');
        });

        promise.fail(function(error) {
          console.log(error);
        });

        promise.always(function() {
          $(parent).off('click');
        });
      }
    });

    // Deleting Lists
  };
});
