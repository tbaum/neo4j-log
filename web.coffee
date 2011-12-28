connect = require 'connect'
neo = require 'neo4js'
#http = require 'http'

url = process.env.NEO4J_URL || 'http://81c130a01:4f382f810@856db9f68.hosted.neo4j.org:7006'

db = new neo.GraphDatabase(url)

make_url = (data)->
  root = db.node(0)
  req = db.node(data)
  rel = db.rel(root, "LOVES", req, { "reason":"All the bling he got." })
  rel.getEndNode().then(bob) ->
    console.log "DONE!" + bob


make_url {test:"data"}

class MyApp
  constructor:->
    debug = {}
    app = connect(
      connect.query()
      connect.router(app) ->
        app.get '/l', (req, res) ->
          debug['query'] = req.query
          debug['header'] = JSON.stringify(req.header)
          debug['headers'] = JSON.stringify(req.headers)
          debug['url'] = req.url
          debug['originalUrl'] = req.originalUrl
          try
            make_url({url:req.url})
          catch e
            console.log e

          res.setHeader('Content-Type', 'image/gif')
          res.end "\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00" +
            "\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00" +
            "\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b", 'binary'

        app.get '/debug', (request, response) ->
          response.end JSON.stringify(debug)

        app.get '/test', (request, response) ->
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
