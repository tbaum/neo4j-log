connect = require 'connect'
connect(
        connect.basicAuth (user, pass) -> auth.user == user && auth.pass == pass
        connect.router (app) ->
            app.get '/', (request, response) ->
                res = {}
                res[instance] = proxy.running() for instance, proxy of proxies
                response.end JSON.stringify(res)

            app.post '/:id', (request, response) ->
                id = request.params.id
                if (proxies[id]) then throw new Error "instance " + id + " is already registered"
                bringUp id
                storeConfig()
                response.end "add "+request.params.id

            app.delete '/:id', (request, response) ->
                id = request.params.id
                if (!proxies[id]) then throw new Error "instance " + id + " is not registered"
                proxies[id].stop()
                delete proxies[id]
                storeConfig()
                response.end "delete "+request.params.id

    ).listen(process.env.PORT || 3000)
