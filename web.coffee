connect = require 'connect'
neo = require 'neo4js'
http = require 'http'

url = process.env.NEO4J_URL || 'http://81c130a01:4f382f810@856db9f68.hosted.neo4j.org:7006'

# console.log url
#
#e = (x,y,z) ->
#  console.log x
#  console.log y
#  console.log z
#
#
#nd = db.node({url:"request.url"}).then((ok)->
#		console.log ok
#	,(f) -> console.log(f))
#
#
#db.node(0).then( (nd)->
#		console.log(nd.getProperty("name"));
#		nd.setProperty("name", "Steven");
#		nd.save().then (s)->
#			console.log("============>saved");

db = new neo.GraphDatabase(url)

class MyApp
	constructor: ->
#		db = db
#		root = db.node(0)
#		console.log ""+root
#		db.node({url:"urll"}).then (req,y,z) ->
#			console.log "HHHHHHHHH"
#			console.log req
#			console.log y
#			console.log z
#		console.log ""+req
#			rel = db.rel(root, "LOVES", req, { reason : "All the bling he got." }).then (x,y,z)->
#				console.log "xHHHHHHHHH"
#				console.log x
#				console.log y
#				console.log z
#				
#		   console.log x
#		   console.log y
#		   console.log z
#		
#		console.log rel
#		rel.getEndNode().then (bob)->
#			console.log "DONE!"						
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
					try
						root = db.node(0)
						req = db.node({url:request.url})
						rel = db.rel(root, "LOVES", req, { "reason" : "All the bling he got." })
						rel.getEndNode().then (bob)->
							console.log "DONE!"+bob						
#						nd.save().then (x)-> console.log("saved") 
					catch e
						console.log e
						
					response.setHeader('Content-Type', 'image/gif');
					response.end "\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00"+
								 "\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00"+
								 "\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b", 'binary'
				app.get '/debug', (request, response) ->
					response.end JSON.stringify(res)
				app.get '/test', (request,response) ->
#					console.log "do test"
#					console.log db
#					nd = db.node({url:request.url}).then(console.log, console.log) 
#					console.log nd
#					node = db.getNodeById 1, (err,node) ->
#						console.log node
#						node.index "id1","hello","world", (err,id) ->
#							console.log err
#							console.id
					response.end "OK"
			connect.static(__dirname + '/public')
		)
		app.listen(process.env.PORT || 3000)

s = new MyApp(db)

#try
#	nd = db.node({url:"more"})
#	nd.save().then((y)->
#			console.log "saved"
#		,(x)->
#			console.log "error"+x
#		)
#catch e
#	console.log e
#
#
console.log "OKKKK"
