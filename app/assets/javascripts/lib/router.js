define(function() {
  return {
    routes: [],
    map: function(routes) {
      var routeEscape = /[\-{}\[\]+?.,\\\^$|#\s]/g;

      Object.keys(routes).forEach(function(route) {
        routeRegEx = new RegExp('^' + route.replace(routeEscape, '\\$&').replace(/(\(\?)?:\w+/g, '([^\/]+)') + '$');
        this.routes.push({route: routeRegEx, callback: routes[route]});
      }, this);

      return this;
    },
    start: function(location) {
      this.routes.forEach(function(handler) {
        if(handler.route.test(location)) {
          if(typeof handler.callback === 'function')
            handler.callback(handler.route.exec(location).slice(1));
          else if(typeof handler.callback === 'object')
            handler.callback.init(handler.route.exec(location).slice(1));
        }
      });
    }
  };
});
