(function() {
  var MyApp, connect, e, http, neo, s, url;

  connect = require('connect');

  neo = require('./node-neo4js.js');

  http = require('http');

  url = process.env.NEO4J_URL || 'http://81c130a01:4f382f810@856db9f68.hosted.neo4j.org:7006';

  e = function(x, y, z) {
    console.log(x);
    console.log(y);
    return console.log(z);
  };

  MyApp = (function() {

    function MyApp() {
      var app, db, res;
      db = new neo.GraphDatabase(url);
      res = {};
      app = connect(connect.query(), connect.router(function(app) {
        app.get('/l', function(request, response) {
          var nd;
          res['query'] = request.query;
          res['header'] = JSON.stringify(request.header);
          res['headers'] = JSON.stringify(request.headers);
          res['url'] = request.url;
          res['originalUrl'] = request.originalUrl;
          nd = db.node({
            url: request.url
          }).then(console.log, console.log);
          response.setHeader('Content-Type', 'image/gif');
          return response.end("\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00" + "\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00" + "\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b", 'binary');
        });
        app.get('/debug', function(request, response) {
          return response.end(JSON.stringify(res));
        });
        return app.get('/test', function(request, response) {
          var nd;
          nd = db.node({
            url: request.url
          }).then(console.log, console.log);
          return response.end("OK");
        });
      }), connect.static(__dirname + '/public'));
      app.listen(process.env.PORT || 3000);
    }

    return MyApp;

  })();

  s = new MyApp();

  console.log("OKKKK");

}).call(this);
