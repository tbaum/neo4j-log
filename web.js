require('coffee-script');

var url = process.env.NEO4J_URL || 'http://81c130a01:4f382f810@856db9f68.hosted.neo4j.org:7006';
var neo = require('neo4js');

var db = new neo.GraphDatabase(url);

var App = require('./myapp');

new App(db);
