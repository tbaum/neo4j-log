connect = require 'connect'

module.exports = class MyApp
  constructor:(@db)->
    db = @db
    node = db.node
    relation = db.rel

    debug = {}

    rel = db.rel(db.node(0), "LOVES", db.node({url:"xxx"}), { "reason":"All the bling he got." })
    console.log rel

    rel.then((bob) ->
        console.log "DONE!" + bob
    )

  app = connect(
    connect.query()
    connect.router((app) ->
        app.get '/l', (req, res) ->
          debug['query'] = req.query
          debug['header'] = JSON.stringify(req.header)
          debug['headers'] = JSON.stringify(req.headers)
          debug['url'] = req.url
          debug['originalUrl'] = req.originalUrl

          rel = relation node(0), "LOVES", node({url:req.url}), { "reason":"All the bling he got." }
          rel.getEndNode().then(bob) ->
            console.log "DONE!" + bob

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

