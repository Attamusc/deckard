define(['jquery', 'hbs!templates/lists/listRow', 'underscore'], function($, listTmpl) {
  var ListsRoute = {
    init: function() {
      this.$new_list_btn = $('#js-add-list');
      this.$new_list_name = $('#js-new-list-name');
      this.$list = $('.lists ul');

      this.bindEvents();

      return this;
    },
    bindEvents: function() {
      _.bindAll(this);

      this.$new_list_btn.on('click', this.onAddButtonClick);
      this.$list.on('click', 'span.list-name', this.onListNameClick);
      this.$list.on('click', 'input', this.onNameInputClick);
      this.$list.on('blur', 'input', this.onNameInputBlur);
      this.$list.on('click', '.remove', this.onRemoveButtonClick);
    },
    onAddButtonClick: function() {
      var self = this;
      var promise = $.ajax({
        url: '/lists.json',
        type: 'POST',
        data: {
          list: { name: this.$new_list_name.val() }
        }
      });

      promise.done(function(data) {
        self.$list.prepend(listTmpl(data));
      });

      promise.fail(function(error) {
        console.log(error);
      });

      promise.always(function() {
        self.$new_list_name.val('');
      });
    },
    onListNameClick: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      var item = evt.target,
          currentContent = item.innerHTML,
          parent = item.parentNode,
          update_location = parent.href
          replacementInput = '<input type="text" data-update-location="' + update_location + '"/>';

      $(item).replaceWith(replacementInput);
      $('input[data-update-location="' + update_location + '"]').focus().val(currentContent);

      $(parent).on('click', function(e) { e.preventDefault(); });
    },
    onNameInputClick: function() {
      evt.preventDefault();
      evt.stopPropagation();
    },
    onNameInputBlur: function(evt) {
      var item = evt.target
          name = item.value,
          $parent = $(item.parentNode),
          $item = $(item);

      if (!$item.hasClass('pending')) {
        $item.addClass('pending');

        var promise = $.ajax({
          url: $item.data('update-location') + '.json',
          type: 'POST',
          data: {
            _method: 'put',
            list: { name: $item.val() }
          }
        });

        promise.done(function(data) {
          $item.replaceWith('<span class="list-name">' + data.name + '</span>');
        });

        promise.fail(function(error) {
          console.log(error);
        });

        promise.always(function() {
          $parent.off('click');
        });
      }
    },
    onRemoveButtonClick: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      var $item = $(evt.target),
          $parent = $item.parent(),
          endpoint = $parent.attr('href') + '.json';

      var promise = $.ajax({
        url: endpoint,
        type: 'POST',
        data: {
          _method: 'delete'
        }
      });

      promise.done(function(data) {
        $parent.parent().remove();
      });

      promise.fail(function(error) {
        console.log(error);
      });
    }
  };

  return ListsRoute;
});
