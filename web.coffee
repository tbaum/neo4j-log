connect = require 'connect'
http = require('http')

class MyApp
	constructor: ->
		res = {}
#		@res = ()-> { res }
		app = connect(
			connect.query()
			connect.router (app) ->
				app.get '/l', (request, response) ->
					res['query'] = request.query
					res['last'] = request.header
					res['url'] = request.url
					res['originalUrl'] = request.originalUrl
					response.setHeader('Content-Type', 'image/gif');
					response.end "\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00"+
								 "\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00"+
								 "\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b", 'binary'
				app.get '/debug', (request, response) ->
					response.end JSON.stringify(res)
			connect.static(__dirname + '/public')
		)

		app.listen(process.env.PORT || 3000)
s = new MyApp()