require('coffee-script');

var url = process.env.NEO4J_URL || 'http://81c130a01:4f382f810@856db9f68.hosted.neo4j.org:7006';
var app = require("./myapp");

app.start(url);
