(function() {
  var connect;

  connect = require('connect');

  connect(connect.router(function(app) {
    return app.get('/', function(request, response) {
      var res;
      res = {
        ok: 'for-me'
      };
      return response.end(JSON.stringify(res));
    });
  })).listen(process.env.PORT || 3000);

}).call(this);
