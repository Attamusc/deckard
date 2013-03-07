require.config({
	baseUrl: '/assets/',
	paths: {
    'jquery': 'vendor/jquery-1.9.1'
  }
});

require(['jquery', 
         'lib/router',
         'routes/lists_route',
         'routes/list_item_route'
], function(jQuery, Router, ListRoute, ListItemRoute) {
  var loc = window.location.pathname,
      csrfToken = $('meta[name=csrf-token]').attr('content');

  // Add a CSRF token to all AJAX requests
  jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
    if (!options.crossDomain) {
      xhr.setRequestHeader('X-CSRF-Token', csrfToken);
    }
  });

  var Deckard = window.Deckard = {};

  Deckard.router = Router.map({
    '/': ListRoute,
    '/lists/:id': ListItemRoute
  });
  
  Deckard.router.start(loc);
});
