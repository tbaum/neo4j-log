connect = require 'connect'
http = require('http')


login = process.env.NEO4J_LOGIN || "81c130a01"
pass = process.env.NEO4J_PASSWORD || "4f382f810"
url = process.env.NEO4J_URL || 'http://856db9f68.hosted.neo4j.org:7006'

neo = require ("./node-neo4j/lib/index.js")
db = new neo.GraphDatabase(url, login + ":" + pass)


class MyApp
	constructor: ->
		res = {}
#		@res = ()-> { res }
		app = connect(
			connect.query()
			connect.router (app) ->
				app.get '/l', (request, response) ->
					res['query'] = request.query
					res['header'] = JSON.stringify(request.header)
					res['headers'] = JSON.stringify(request.headers)
					res['url'] = request.url
					res['originalUrl'] = request.originalUrl
					response.setHeader('Content-Type', 'image/gif');
					response.end "\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00"+
								 "\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00"+
								 "\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b", 'binary'
				app.get '/debug', (request, response) ->
					response.end JSON.stringify(res)
				app.get '/test', (request,response) ->
					node = db.getNodeById 1, (err,node) ->
						console.log node
						node.index "id1","hello","world", (err,id) ->
							console.log err
							console.id
					response.end "OK"
			connect.static(__dirname + '/public')
		)

		app.listen(process.env.PORT || 3000)
s = new MyApp()

# console.log process.env

# cread 81c130a01:4f382f810


#request = require 'request'
#res = request.get {url:url, headers:{Authorization: "Basic ODFjMTMwYTAxOjRmMzgyZjgxMA=="}} , (x,y,z) ->
#	console.log x
#	console.log y

#console.log "============================"
#console.log res.body

if (1<2)

	print = (err, res) ->
    	console.log(err || (res && res.self) || res);

#	node = db.createNode({hello: 'world'})
#	node.save(print)


#	rel = db.getRelationshipById(1, print)


#_ = require "jquery"
#neo4j = require "./neo4js.js"

#graph = neo4j.GraphDatabase(url)

#lisaPromise = graph.node({ "name" : "Lisa" });
#bobPromise = graph.node({ "name" : "Bob" });

#lovePromise = graph.rel(lisaPromise, "LOVES", bobPromise, { "reason" : "All the bling he got." });

# // Wait for the promise of a relationship to be fulfilled.
#lovePromise.then (relationship) ->
#	relationship.getEndNode().then (bob)->
#		name = bob.getProperty("name");
#		bob.setProperty("name", "Steven");
#		bob.save().then (steven)->
#			console.log("saved")



