connect = require 'connect'
neo = require './node-neo4js.js'
http = require 'http'

url = process.env.NEO4J_URL || 'http://81c130a01:4f382f810@856db9f68.hosted.neo4j.org:7006'

# console.log url

db = new neo.GraphDatabase(url)
e = (x,y,z) ->
  console.log x
  console.log y
  console.log z


#db.node(0).then( (nd)->
#		console.log(nd.getProperty("name"));
#		nd.setProperty("name", "Steven");
#		nd.save().then (s)->
#			console.log("============>saved");

class MyApp
	constructor: ->
		res = {}
		app = connect(
			connect.query()
			connect.router (app) ->
				app.get '/l', (request, response) ->
					res['query'] = request.query
					res['header'] = JSON.stringify(request.header)
					res['headers'] = JSON.stringify(request.headers)
					res['url'] = request.url
					res['originalUrl'] = request.originalUrl
					nd = db.node({url:request.url}).then((ok)->
							console.log ok
						,(f) -> console.log(f))
						
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
		console.log("XXX");
		app.listen(process.env.PORT || 3000)

s = new MyApp()

console.log "OKKKK"
