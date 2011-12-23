(function() {
  var MyApp, connect, s;

  connect = require('connect');

  MyApp = (function() {

    function MyApp() {
      var res;
      res = {};
      this.res = function() {
        return {
          res: res
        };
      };
      connect(connect.router(function(app) {
        app.get('/l', function(request, response) {
          res['last'] = JSON.stringify(request.header);
          res['url'] = request.url;
          res['originalUrl'] = request.originalUrl;
          return response.end("OK");
        });
        return app.get('/', function(request, response) {
          return response.end(JSON.stringify(res));
        });
      })).listen(process.env.PORT || 3000);
    }

    return MyApp;

  })();

  s = new MyApp();

}).call(this);
