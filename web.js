require('coffee-script');

var url = process.env.NEO4J_URL || 'http://763e55420:7730ee0cf@e0556e429.hosted.neo4j.org:7006';
var neo = require('neo4js');

var db = new neo.GraphDatabase(url);

var App = require('./myapp');

new App(db);
