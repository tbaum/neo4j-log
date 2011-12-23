(function() {
  var connect;

  connect = require('connect');

  connect(connect.basicAuth(function(user, pass) {
    return auth.user === user && auth.pass === pass;
  }), connect.router(function(app) {
    app.get('/', function(request, response) {
      var instance, proxy, res;
      res = {};
      for (instance in proxies) {
        proxy = proxies[instance];
        res[instance] = proxy.running();
      }
      return response.end(JSON.stringify(res));
    });
    app.post('/:id', function(request, response) {
      var id;
      id = request.params.id;
      if (proxies[id]) {
        throw new Error("instance " + id + " is already registered");
      }
      bringUp(id);
      storeConfig();
      return response.end("add " + request.params.id);
    });
    return app["delete"]('/:id', function(request, response) {
      var id;
      id = request.params.id;
      if (!proxies[id]) throw new Error("instance " + id + " is not registered");
      proxies[id].stop();
      delete proxies[id];
      storeConfig();
      return response.end("delete " + request.params.id);
    });
  })).listen(process.env.PORT || 3000);

}).call(this);
