(function() {
  var MyApp, connect, db, http, login, neo, pass, print, s, url;

  connect = require('connect');

  http = require('http');

  login = process.env.NEO4J_LOGIN || "81c130a01";

  pass = process.env.NEO4J_PASSWORD || "4f382f810";

  url = process.env.NEO4J_URL || 'http://856db9f68.hosted.neo4j.org:7006';

  neo = require("./node-neo4j/lib/index.js");

  db = new neo.GraphDatabase(url, login + ":" + pass);

  MyApp = (function() {

    function MyApp() {
      var app, res;
      res = {};
      app = connect(connect.query(), connect.router(function(app) {
        app.get('/l', function(request, response) {
          res['query'] = request.query;
          res['header'] = JSON.stringify(request.header);
          res['headers'] = JSON.stringify(request.headers);
          res['url'] = request.url;
          res['originalUrl'] = request.originalUrl;
          response.setHeader('Content-Type', 'image/gif');
          return response.end("\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00" + "\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00" + "\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b", 'binary');
        });
        app.get('/debug', function(request, response) {
          return response.end(JSON.stringify(res));
        });
        return app.get('/test', function(request, response) {
          var node;
          node = db.getNodeById(1, function(err, node) {
            console.log(node);
            return node.index("id1", "hello", "world", function(err, id) {
              console.log(err);
              return console.id;
            });
          });
          return response.end("OK");
        });
      }), connect.static(__dirname + '/public'));
      app.listen(process.env.PORT || 3000);
    }

    return MyApp;

  })();

  s = new MyApp();

  if (1 < 2) {
    print = function(err, res) {
      return console.log(err || (res && res.self) || res);
    };
  }

}).call(this);
