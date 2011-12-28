(function() {
  var MyApp, connect, db, http, neo, s, url;

  connect = require('connect');

  neo = require('neo4js');

  http = require('http');

  url = process.env.NEO4J_URL || 'http://81c130a01:4f382f810@856db9f68.hosted.neo4j.org:7006';

  db = new neo.GraphDatabase(url);

  MyApp = (function() {

    function MyApp() {
      var app, res;
      res = {};
      app = connect(connect.query(), connect.router(function(app) {
        app.get('/l', function(request, response) {
          var rel, req, root;
          res['query'] = request.query;
          res['header'] = JSON.stringify(request.header);
          res['headers'] = JSON.stringify(request.headers);
          res['url'] = request.url;
          res['originalUrl'] = request.originalUrl;
          try {
            root = db.node(0);
            req = db.node({
              url: request.url
            });
            rel = db.rel(root, "LOVES", req, {
              "reason": "All the bling he got."
            });
            rel.getEndNode().then(function(bob) {
              return console.log("DONE!" + bob);
            });
          } catch (e) {
            console.log(e);
          }
          response.setHeader('Content-Type', 'image/gif');
          return response.end("\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00" + "\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00" + "\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b", 'binary');
        });
        app.get('/debug', function(request, response) {
          return response.end(JSON.stringify(res));
        });
        return app.get('/test', function(request, response) {
          return response.end("OK");
        });
      }), connect.static(__dirname + '/public'));
      app.listen(process.env.PORT || 3000);
    }

    return MyApp;

  })();

  s = new MyApp(db);

  console.log("OKKKK");

}).call(this);
