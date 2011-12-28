connect = require 'connect'
neo = require 'neo4js'

class MyApp
  constructor:(url)->
    db = new neo.GraphDatabase(url)
    debug = {}
    _db = -> db
    app = connect(
      connect.query()
      connect.router((app) ->
          app.get '/l', (req, res) ->
            debug['query'] = req.query
            debug['header'] = JSON.stringify(req.header)
            debug['headers'] = JSON.stringify(req.headers)
            debug['url'] = req.url
            debug['originalUrl'] = req.originalUrl
            try
              console.log "okkkkk"
              console.log "y " + _db
              console.log "x " + _db()
              db = _db()
              root = db.node(0)
              req = db.node {url:req.url}
              rel = db.rel(root, "LOVES", req, { "reason":"All the bling he got." })
              rel.getEndNode().then(bob) ->
                console.log "DONE!" + bob
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
      )
      connect.static(__dirname + '/public')
    )
    app.listen(process.env.PORT || 3000)

  make_url:(data)->
    console.log "make_url"
    root = db.node(0)
    req = db.node(data)
    rel = db.rel(root, "LOVES", req, { "reason":"All the bling he got." })
    rel.getEndNode().then(bob) ->
      console.log "DONE!" + bob

exports.start = (url)->
  new MyApp url



