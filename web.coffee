connect = require 'connect'

class MyApp
	constructor: ->
		res = {}
		@res = ()-> { res }
		console.log "XXXXXXXXXXXXXXXXX"
		console.log __dirname
		console.log process.env
		connect(
#        connect.basicAuth (user, pass) -> auth.user == user && auth.pass == pass
			connect.router (app) ->
				app.get '/l', (request, response) ->
					res['last'] = JSON.stringify(request.header)
					res['url'] = request.url
					res['originalUrl'] = request.originalUrl
					response.end "OK"

				app.get '/', (request, response) ->
#                res = { ok : 'for-me' }
#                res[instance] = proxy.running() for instance, proxy of proxies
					response.end JSON.stringify(res)
			connect.static(__dirname + '/public', { maxAge: 0 })
		).listen(process.env.PORT || 3000)


s = new MyApp()