(function() {
  var MyApp, connect, db, make_url, neo, s, url;

  connect = require('connect');

  neo = require('neo4js');

  url = process.env.NEO4J_URL || 'http://81c130a01:4f382f810@856db9f68.hosted.neo4j.org:7006';

  db = new neo.GraphDatabase(url);

  make_url = function(data) {
    var rel, req, root;
    root = db.node(0);
    req = db.node(data);
    rel = db.rel(root, "LOVES", req, {
      "reason": "All the bling he got."
    });
    return rel.getEndNode().then(bob)(function() {
      return console.log("DONE!" + bob);
    });
  };

  make_url({
    test: "data"
  });

  MyApp = (function() {

    function MyApp() {
      var app, debug;
      debug = {};
      app = connect(connect.query(), connect.router(app)(function() {
        app.get('/l', function(req, res) {
          debug['query'] = req.query;
          debug['header'] = JSON.stringify(req.header);
          debug['headers'] = JSON.stringify(req.headers);
          debug['url'] = req.url;
          debug['originalUrl'] = req.originalUrl;
          try {
            make_url({
              url: req.url
            });
          } catch (e) {
            console.log(e);
          }
          res.setHeader('Content-Type', 'image/gif');
          return res.end("\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00" + "\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00" + "\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b", 'binary');
        });
        app.get('/debug', function(request, response) {
          return response.end(JSON.stringify(debug));
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
