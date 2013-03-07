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
          handler.callback(handler.route.exec(location).splice(1));
        }
      });
    }
  };
});
