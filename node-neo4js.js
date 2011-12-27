/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var _ = require("underscore");

var window = { location:{} };
var Http = require('http');
var Url = require('url');

var $ = {
    _auth_cache:{},
    ajax:function (args) {
        var url = Url.parse(args.url);
        console.log(args.type + " " + args.url);

        var opts = {
            host:url.hostname,
            port:url.port,
            path:url.path,
            method:args.type
        };

        if (url.auth) {
            var auth = new Buffer(url.auth, "ascii").toString("base64");
            $._auth_cache[url.hostname] = auth;
            opts.headers = { Authorization:"Basic " + auth}
        }
        else if ($._auth_cache[url.hostname]) {  // TODO fix this!!
            opts.headers = { Authorization:"Basic " + $._auth_cache[url.hostname]}
        }

        var request = Http.request(opts, function (response) {
            response.setEncoding('utf8');
            var data;
            response.on('data', function (chunk) {
                data = chunk;
            });
            response.on('end', function () {
                try {
                    if (args.processData) {
                        data = JSON.parse(data);
                    }
                    args.success(data, response.statusCode, {xhr:1});
                } catch (e) {
                    args.error(e);
                }
            });

        });
        request.on('error', args.error);
        if (args.data != undefined && args.data != '') {
            request.write(args.data)
        }
        request.end();
    }
};


/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @namespace globally available namespace under which all parts of neo4js are
 *            available.
 */
var neo4j = neo4j || {};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @namespace namespace containing clients to REST server services.
 */
neo4j.services = neo4j.services || {};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @namespace Exception namespace.
 */
neo4j.exceptions = neo4j.exceptions || {};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Triggered when there is some error in transit or on the server
 * side.
 */
neo4j.exceptions.HttpException = function(status, data, req, message) {
    var message = message || "A server error or a network error occurred. Status code: " + status + ".";
    this.status = status;
    this.data = data || {};
    this.req = req || {};
    Error.call(this, message);
};

neo4j.exceptions.HttpException.prototype = new Error();

/**
 * These are used to generate #isConflict(), #isNotFound() etc.,
 * based on the keys of this map.
 */
neo4j.exceptions.HttpException.RESPONSE_CODES = {
    'Conflict' : 409,
    'NotFound' : 404 
};

/**
 * Generate methods to rapidly check what a given response
 * code means.
 */
(function() {
    var ex = neo4j.exceptions.HttpException.prototype, 
        codes = neo4j.exceptions.HttpException.RESPONSE_CODES;
    _.each(_.keys(codes), function(key) {
        ex['is' + key] = function() {
            return this.status === codes[key];
        };
    });
})();
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Triggered when there is some error in transit or on the server
 * side.
 */
neo4j.exceptions.ConnectionLostException = function() {
    
    neo4j.exceptions.HttpException.call(this, -1, null, null, "The server connection was lost.");
    
};

neo4j.exceptions.HttpException.prototype = new neo4j.exceptions.HttpException();
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Triggered when a node or relationship cannot be found.
 */
neo4j.exceptions.NotFoundException = function(url) {
    Error.call(this, "The object at url " + url + " does not exist.");
    this.url = url;
};

neo4j.exceptions.NotFoundException.prototype = new Error();

/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Triggered when instantiating a node or relationship with invalid data.
 */
neo4j.exceptions.InvalidDataException = function() {
    Error.call(this, "Unable to create relationship or node from the provided data. This may be because you tried to get a node or relationship from an invalid url.");
};

neo4j.exceptions.InvalidDataException.prototype = new Error();

/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Triggered when creating self-relationships.
 */
neo4j.exceptions.StartNodeSameAsEndNodeException = function(url) {
    Error.call(this, "You cannot create a relationship with the same start and end node.");
    this.url = url;
};

neo4j.exceptions.StartNodeSameAsEndNodeException.prototype = new Error();

/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

_.extend(neo4j, {

    /**
     * This checks if there is there is a setTimeout method available. If not,
     * this will trigger the method directly if timeout is 0, or throw
     * an exception if timeout is greater than that. 
     */
    setTimeout : function( expression, timeout ) {
        if(typeof(setTimeout) != "undefined") {
            return setTimeout(expression, timeout);
        } else if (timeout === 0) {
            expression();
        } else {
            neo4j.log("No timeout implementation found, unable to do timed tasks.");
        }
    },
    
    clearTimeout : function(timeoutId) {
        if(typeof(clearTimeout) != "undefined") {
            clearTimeout(intervalId);
        } else {
            neo4j.log("No timeout implementation found, unable to do timed tasks.");
        }
    },
    
    _intervals : {}
});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
_.extend(neo4j, {

	/**
	 * This checks if there is there is a setInterval method available, delegates
	 * to that if possible, or provides its own implementation otherwise. 
	 */
	setInterval : function( expression, interval ) {
		if(typeof(setInterval) != "undefined") {
			return setInterval(expression, interval);
		} else if(typeof(setTimeout) != "undefined") {
			var id = (new Date()).getTime();
			
			function intervalCallback() {
				expression();
				neo4j._intervals[id] = setTimeout(intervalCallback, interval);
			}
			
			neo4j._intervals[id] = setTimeout(intervalCallback, interval);
			return id;
		} else {
			neo4j.log("No timeout or interval implementation found, unable to do timed tasks.");
		}
	},
	
	clearInterval : function(intervalId) {
		if(typeof(clearInterval) != "undefined") {
			clearInterval(intervalId);
		} else if (typeof(clearTimeout) != "undefined") {
			clearTimeout(neo4j._intervals[intervalId]);
		} else {
			neo4j.log("No timeout or interval implementation found, unable to do timed tasks.");
		}
	},
	
	_intervals : {}
});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Used to represent a future value, same or similar to "future" and "delay"
 * pattern.
 * 
 * Inspired by Ron Bucktons lightweight Promise implementation.
 *
 * @class
 * @param init A function that will get passed two arguments,
 *             fulfill and fail. Call one to either fulfill
 *             or fail the promise.
 */
neo4j.Promise = function(init) {

	_.bindAll(this, 'then', 'fulfill', 'fail', 'addHandlers', 
	        'addFulfilledHandler', 'addFailedHandler','_callHandlers',
			'_callHandler', '_addHandler');
	
	this._handlers = [];

	if (typeof (init) === "function") {
		init(this.fulfill, this.fail);
	}
};

/**
 * Ensure that a variable is a promise. If the argument passed is already a
 * promise, the argument will be returned as-is. If it is not a promise, the
 * argument will be wrapped in a promise that is instantly fulfilled.
 */
neo4j.Promise.wrap = function(arg) {
	if (arg instanceof neo4j.Promise) {
		return arg;
	} else {
		return neo4j.Promise.fulfilled(arg);
	}
};

/**
 * Create a promise that is instantly fulfilled. Useful for wrapping values to
 * be sent into promise-based code.
 */
neo4j.Promise.fulfilled = function(value) {
	return new neo4j.Promise(function(fulfill) {
		fulfill(value);
	});
};

/**
 * Join several promises together, pass
 * as many promises as you like in as arguments.
 * @return A new promise that will be fulfilled when
 *         all joined promises are fulfilled. 
 */
neo4j.Promise.join = function() {
    var joined = _.toArray(arguments);
    if(joined.length == 1) {
        return joined[0];
    } else {
        return new neo4j.Promise(function(fulfill, fail){
            var results = [];
            
            function waitForNextPromise(promises) {
                if(promises.length > 0) {
                    promises.shift().addFulfilledHandler(function(result){
                        results.push(result);
                        waitForNextPromise(promises);
                    });
                } else {
                    fulfill(results);
                }
            }
            
            // Hook directly into all failed handlers, to allow
            // failing early.
            for(var i=0, l=joined.length; i<l; i++) {
                joined[i].addFailedHandler(fail);
            }
            
            waitForNextPromise(joined);
        });
    }
};

_.extend(neo4j.Promise.prototype, {
  /** @lends neo4j.Promise# */  
  
	/**
	 * Add callbacks to handle when this promise is fulfilled or broken. Returns
	 * a new promise that is controlled by fulfill/fail methods sent to 
	 * the handlers.
	 * 
	 * Example:
	 * 
	 * var p = new neo4j.Promise( [some promising code]);
	 * 
	 * var newPromise = p.then(function(promisedValue, fulfill, fail) {
	 *     fulfill(promisedValue); // Fulfill "newPromise"
	 * });
	 * 
	 * If no fail (or fulfill) handler is provided when calling this, 
	 * the returned promise will forward fulfill and/or fail calls from
	 * the original promise.
	 * 
	 * @param onPromiseFulfilled
	 *            Will be called with the value promised if the promise is
	 *            fulfilled.
	 * @param onPromiseBroken
	 *            Will be called if the promise is broken, optionally with a
	 *            failed result of some kind, depending on the code that fails
	 *            the promise.
	 */
	then : function(onPromiseFulfilled, onPromiseBroken) {
		var parentPromise = this;
		return new neo4j.Promise(function(fulfill, fail) {
			parentPromise.addHandlers(
			    function(result) {
					if (onPromiseFulfilled) {
						onPromiseFulfilled(result, fulfill, fail);
					} else {
						fulfill(result);
					}
				},
				function(result) {
					if (typeof(onPromiseBroken) === "function") {
						onPromiseBroken(result, fulfill, fail);
					} else {
						fail(result);
					}
				}
			);
		});
	},
	
	/**
	 * Used to chain promises together. Contract:
	 * Do not fulfill or fail this promise until the promise added 
	 * here is fulfilled. Fail this promise if the chained promise fails. 
	 */
	chain : function(otherPromise) {
	    var promise = this;
	    this.chainedPromise = otherPromise;
	    otherPromise.then(null, function(result){
	        promise.fail(result);
	    });
	},

	fulfill : function(result) {
	    if(this.chainedPromise) {
    	    var promise = this;
    	    this.chainedPromise.then(function(){
    	       promise._fulfill(result); 
    	    });
	    } else {
	        this._fulfill(result);
	    }
	},

	fail : function(result) {
        if( ! this._complete ) { 
    		this._failedResult = result;
    		this._fulfilled = false;
    		this._complete = true;
    		this._callHandlers();
        }
	},
    
    _fulfill : function(result) {
        if( ! this._complete) { 
            this._fulfilledResult = result;
            this._fulfilled = true;
            this._complete = true;
            this._callHandlers();
        }
    },

	_callHandlers : function() {
		_.each(this._handlers, this._callHandler);
	},

	_callHandler : function(handler) {
		if (this._fulfilled && typeof(handler.fulfilled) === "function") {
			handler.fulfilled(this._fulfilledResult);
		} else if(typeof(handler.failed) === "function") {
			handler.failed(this._failedResult);
		}
	},

	addHandlers : function(fulfilled, failed) {
	    fulfilled = fulfilled || function() {};
	    failed = failed || function() {};
	    this._addHandler({fulfilled:fulfilled, failed:failed});
	},
    
    addFulfilledHandler : function(fulfilled) {
        this.addHandlers(fulfilled);  
    },
	
	addFailedHandler : function(failed) {
	    this.addHandlers(null, failed);  
	},
	
	_addHandler : function(handler) {
		if (this._complete) {
			this._callHandler(handler);
		} else {
			this._handlers.push(handler);
		}
	}

});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Used to wrap a tiny cache around a single function. Currently only works for
 * functions that return their result via callbacks.
 * 
 * This is extremely simplistic, it does not take into account using different
 * parameters and so on, it simply caches the first response the function makes,
 * and then keeps responding with that answer.
 * 
 * @param func
 *            is the function to wrap
 * @param callbackArg
 *            is the position of the callback argument to the wrapped function.
 * @param timeout
 *            (optional) is the time in milliseconds before the cache becomes
 *            invalid, default is infinity (-1).
 */
neo4j.cachedFunction = function(func, callbackArg, timeout) {

    var cachedResult = null,
        cachedResultContext = null,
        isCached = false,
        timeout = timeout || false,
        waitingList = [];

    return function wrap() {
        var callback = arguments[callbackArg];

        if (isCached)
        {
            callback.apply(cachedResultContext, cachedResult);
        } else
        {

            waitingList.push(callback);
        	
            if (waitingList.length === 1)
            {

                arguments[callbackArg] = function() {
                    cachedResultContext = this;
                    cachedResult = arguments;
                    isCached = true;

                    for ( var i in waitingList)
                    {
                        waitingList[i].apply(cachedResultContext, cachedResult);
                    }

                    waitingList = [];

                    if (timeout)
                    {
                        setTimeout(function() {
                            isCached = false;
                        }, timeout);
                    }
                };

                func.apply(this, arguments);

            }

        }
    };
}
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Thin wrapper around console.log, making sure it exists.
 * @param anything, all will be passed to console.log
 */
neo4j.log = function() {
    if( typeof(console) != "undefined" && typeof(console.log) === "function") {
    	console.log.apply(this, arguments);
    }
};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This allows wrapping methods in closures, allowing them
 * to always be run in some pre-determined context.
 */
neo4j.proxy = function(arg1, arg2) {
  
    return _.bind(arg1, arg2);
    
};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * A simple event-handling system.
 * 
 * @class
 * @param context {object} (optional) context data to be included with event objects
 */
neo4j.Events = function(context) {

    this.uniqueNamespaceCount = 0; // Used to create unique namespaces
    this.handlers = {};
    this.context = context || {};

}

/**
 * Naive implementation to quickly get anonymous event namespaces.
 */
neo4j.Events.prototype.createUniqueNamespace = function() {
    return "uniq#" + (this.uniqueNamespaceCount++);
};

/**
 * Bind an event listener to an event.
 */
neo4j.Events.prototype.bind = function(key, callback) {
    if (typeof (this.handlers[key]) === "undefined")
    {
        this.handlers[key] = [];
    }

    this.handlers[key].push(callback);
};

/**
 * Trigger an event.
 */
neo4j.Events.prototype.trigger = function(key, data) {
    
    if (typeof (this.handlers[key]) !== "undefined")
    {

        var data = data || {};

        var eventHandlers = this.handlers[key];
        var event = _.extend({
            key : key,
            data : data
        }, this.context);

        for ( var i = 0, o = eventHandlers.length; i < o; i++)
        {
            neo4j.setTimeout((function(handler) {
                return function() {
                    try
                    {
                        handler(event);
                    } catch (e)
                    {
                        neo4j.log("Event handler for event " + key + " threw exception.",e);
                    }
                }
            })(eventHandlers[i]), 0);
        }
    }
};

//
// CREATE A GLOBAL EVENT HANDLER
//

/**
 * Global event handler. Instance of {@link neo4j.Events}.
 */
neo4j.events = new neo4j.Events()
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Web provider using jQuery.
 * 
 * @namespace
 */
neo4j.jqueryWebProvider = {

    /**
	 * Ajax call implementation.
	 */
    ajax : function(args) {
        
        var timeout = args.timeout || 6 * 60 * 60 * 1000,
            method = args.method,
            url = args.url,
            data = args.data,
            success = args.success,
            failure = args.failure,
            isGetRequest = method === "GET";
        
        function successHandler(data, status, xhr) {
            if ( xhr.status === 0 ) {
                errorHandler(xhr);
            } else {
                success.apply(this, arguments);
            }
        }
        
        function errorHandler(req) {
            try {
                if (req.status === 200)
                {
                    // This happens when the
                    // server returns an
                    // empty response.
                    return success(null);
                }
            } catch (e) {
                // We end up here if there
                // is no status to read
            }
            try
            {
            	if( req.status === 0 ) {
            	    failure(new neo4j.exceptions.ConnectionLostException());
            	} else {
                  var error = JSON.parse(req.responseText);
                  failure(new neo4j.exceptions.HttpException(req.status, error, req));
            	}
            } catch (e)
            {
                failure(new neo4j.exceptions.HttpException(-1, {}, req));
            }
	    }

	    var isCrossDomain = this.isCrossDomain;
        (function(method, url, data, success, failure) {

            if (data === null || data === "null")
            {
                data = "";
            } else if(!isGetRequest)
            {
                data = JSON.stringify(data);
            }

            if (isCrossDomain(url) && window.XDomainRequest)
            {
                // IE8 Cross domain
                // TODO
                if (typeof (failure) === "function")
                {
                    failure(new neo4j.exceptions.HttpException(-1, null, null, "Cross-domain requests are available in IE, but are not yet implemented in neo4js."));
                }
            } else
            {
            	$.ajax({
                    url : url,
                    type : method,
                    data : data,
                    timeout: timeout,
                    cache: false,
                    // Let jquery turn data map into query string
                    // only on GET requests.
                    processData : isGetRequest, 
                    success : successHandler,
                    contentType : "application/json",
                    error : errorHandler,
                    dataType : "json"
                });
            }
        })(method, url, data, success, failure);
    },

    /**
	 * Check if a url is cross-domain from the current window.location url.
	 */
    isCrossDomain : function(url) {
        if (url)
        {
            var httpIndex = url.indexOf("://");
            if (httpIndex === -1 || httpIndex > 7)
            {
                return false;
            } else
            {
                return url.substring(httpIndex + 3).split("/", 1)[0] !== window.location.host;
            }
        } else
        {
            return false;
        }
    }
};

/**
 * Interface to jQuery AJAX library. This is here to enable a fairly simple
 * expansion to make other AJAX libraries available as underlying
 * implementation, thus dropping dependency on jQuery.
 */
neo4j.Web = function(webProvider, events) {

    this.webProvider = webProvider || neo4j.jqueryWebProvider;
    this.events = events || neo4j.events;

};

_.extend(neo4j.Web.prototype, {

    /**
	 * Perform a GET http request to the given url.
	 * 
	 * @param url
	 *            is the url to send the request to
	 * @param data
	 *            (optional) javascript object to send as payload. This will
	 *            be converted to JSON.
	 * @param success
	 *            (optional) callback called with de-serialized JSON
	 *            response data as argument
	 * @param failure
	 *            (optional) callback called with failed request object
	 */
    get : function(url, data, success, failure) {
        return this.ajax("GET", url, data, success, failure);
    },

    /**
	 * Perform a POST http request to the given url.
	 * 
	 * @param url
	 *            is the url to send the request to
	 * @param data
	 *            (optional) javascript object to send as payload. This will
	 *            be converted to JSON.
	 * @param success
	 *            (optional) callback called with de-serialized JSON
	 *            response data as argument
	 * @param failure
	 *            (optional) callback called with failed request object
	 */
    post : function(url, data, success, failure) {
        return this.ajax("POST", url, data, success, failure);
    },

    /**
	 * Perform a PUT http request to the given url.
	 * 
	 * @param url
	 *            is the url to send the request to
	 * @param data
	 *            (optional) javascript object to send as payload. This will
	 *            be converted to JSON.
	 * @param success
	 *            (optional) callback called with de-serialized JSON
	 *            response data as argument
	 * @param failure
	 *            (optional) callback called with failed request object
	 */
    put : function(url, data, success, failure) {
        return this.ajax("PUT", url, data, success, failure);
    },

    /**
	 * Perform a DELETE http request to the given url.
	 * 
	 * @param url
	 *            is the url to send the request to
	 * @param data
	 *            (optional) javascript object to send as payload. This will
	 *            be converted to JSON.
	 * @param success
	 *            (optional) callback called with de-serialized JSON
	 *            response data as argument
	 * @param failure
	 *            (optional) callback called with failed request object
	 */
    del : function(url, data, success, failure) {
        return this.ajax("DELETE", url, data, success, failure);
    },

    /**
	 * Perform a http request to the given url.
	 * 
	 * TODO: Refactor to sort out which arg is which at a single point.
	 * 
	 * @param method
	 *            is the HTTP method to use (e.g. PUT, POST, GET, DELETE)
	 * @param url
	 *            is the url to send the request to
	 * @param data
	 *            (optional) javascript object to send as payload. This will
	 *            be converted to JSON.
	 * @param success
	 *            (optional) Callback called with de-serialized JSON
	 *            response data as argument. You can also use the promise
	 *            returned to hook into this callback.
	 * @param failure
	 *            (optional) Callback called with failed request object.
	 *            You can also use the promise returned to hook into this 
	 *            callback.
	 * @return A promise for a http response.
	 */
    ajax : function() {
        
        var args = this._processAjaxArguments(arguments),
            web = this;
        
        args.userFail = this.wrapFailureCallback(args.failure);
        args.userSuccess = args.success;
        
	    return new neo4j.Promise(function(fulfill, fail) {
	        args.failure = function() {
	            fail.call(this, {error:arguments[0], args:arguments});
	            args.userFail.apply(this, arguments);
	        };
	        
	        args.success = function() {
                fulfill.call(this, {data:arguments[0],args:arguments});
                args.userSuccess.apply(this, arguments);
            };
	        
	        try {
	            web.webProvider.ajax(args);
	        } catch (e) {
	            args.failure(e);
	        }
	    });

    },
    
    /**
     * Check if a given string seems to be a URL.
     */
    looksLikeUrl : function(theUnknownString) {
    	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(theUnknownString);
    },

    /**
	 * Set the provider that should be used to do ajax requests.
	 * 
	 * @see {@link neo4j.Web#ajax} for how the provider is used
	 */
    setWebProvider : function(provider) {
        this.webProvider = provider;
    },

    /**
	 * Take a url with {placeholders} and replace them using a map of
	 * placeholder->string.
	 */
    replace : function(url, replaceMap) {
        var out = {url:url};
        _.each(_.keys(replaceMap), function(key) {
            out.url = out.url.replace("{" + key + "}", replaceMap[key]);
        });
        return out.url;
    },
    
    /**
     * Wraps a failure callback for web requests. This handles web errors like
     * connection failures, and triggers events accordingly.
     */
    wrapFailureCallback : function(cb) {
        var events = this.events;
    	return function(ex) {
    		if( typeof(ex) != "undefined" && ex instanceof neo4j.exceptions.ConnectionLostException ) {
    			events.trigger("web.connection_lost", _.toArray(arguments));
    			
    			// For backwards compatibility
    			events.trigger("web.connection.failed", _.toArray(arguments));
    		}

            cb.apply(this, arguments);
    	};
    },
    
    /**
     * Go through the arguments array that the ajax method recieves,
     * and return a map containing appropriate handlers, request method,
     * data and url.
     */
    _processAjaxArguments : function(args) {
        var method, url, data, success, failure,
            args = _.toArray(args);
        
        method = args.shift();
        url = args.shift();
        
        data = args.length > 0 && !_.isFunction(args[0]) ? args.shift() : null;       
        
        success = args.length > 0 ? args.shift() : null;
        failure = args.length > 0 ? args.shift() : null;
        
        success = _.isFunction(success) ? success : function() {};
        failure = _.isFunction(failure) ? failure : function() {};
        
        return {
            method : method, 
            url : url,
            data : data,
            success : success,
            failure : failure
        }
    }

});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Creates event handling system for this service, as well as initializing
 * various properties.
 * 
 * Sets the this.db attribute. Also hooks an event listener that waits for the
 * services.loaded event. If services.loaded is triggered, and this service is
 * not initialized, it is assumed that this service is not available.
 * 
 * @class parent class that provides common items for services, such as a http
 *        interface.
 */
neo4j.Service = function(db) {
	
    /**
     * List of commands waiting to be run as soon as the service is initialized.
     */
    this.callsWaiting = [];

    this.loadServiceDefinition = neo4j.cachedFunction(this.loadServiceDefinition,0);
    
    /**
     * Event handler. This is unique for each service.
     * 
     * @see {@link neo4j.Events}
     */
    this.events = new neo4j.Events();

    /**
     * Convinience access to event bind method.
     */
    this.bind = neo4j.proxy(this.events.bind, this.events);

    /**
     * Convinience access to event trigger method.
     */
    this.trigger = neo4j.proxy(this.events.trigger, this.events);

    /**
     * A reference to the GraphDatabase instance.
     */
    this.db = db;
    
    this.db.bind("services.loaded", neo4j.proxy(function() {
        if (!this.initialized)
        {
            this.setNotAvailable();
        }
    }, this));
};

/**
 * Used to generate boilerplate for service methods.
 * 
 * @param args
 *            is an argument map
 * 
 * @param args.method
 *            is the http method to call the server with
 * @param args.resource
 *            is the resource key, as available in this.resources
 * @param args.urlArgs
 *            (optional) is an array of named arguments that map to placeholders
 *            in the url
 * @param args.after
 *            (optional) will be called with the data from the server and the
 *            callback waiting to have it.
 * @param args.before
 *            (optional) will be called with a method to be called, and the 
 *            data passed by the user. If you supply this, you have to do
 *            something like "method.apply(this, args);" in the least, in
 *            order to trigger the call to the server.
 * @param args.errorHandler
 *            (optional) handler for when something goes wrong. Gets an error
 *            object and the callback waiting for a response.
 */
neo4j.Service.resourceFactory = function(args) {

    var urlArgs = args.urlArgs || [];
    var urlArgCount = urlArgs.length;
    
    var after = args.after ? args.after
            : function(data, callback) {
                callback(data);
            };

    var before = args.before ? args.before : function(method, args) {
        method.apply(this, args);
    };
    
    var errorHandler = args.errorHandler ? args.errorHandler : function(callback, error) {
        callback({ message : "An error occurred, please see attached error object.", error : error });
    };

    /**
     * This is the core method for accessing resources. It will perform the
     * actual http call and pass the result onwards.
     */
    var resourceFunction = function() {
      
        var proxiedAfter = neo4j.proxy(after,this);
        var proxiedErrorHandler = neo4j.proxy(errorHandler,this);
        
        // Figure out what URL to call
        if (urlArgCount > 0)
        {
            var replace = {};
            for ( var i = 0; i < urlArgCount; i++)
            {
                replace[urlArgs[i]] = arguments[i];
            }

            var url = this.db.web.replace(this.resources[args.resource], replace);

        } else
        {
            var url = this.resources[args.resource];
        }

        var data = null;
        var callback = function() {
        };

        // Are there any extra args?
        if (arguments.length > urlArgCount)
        {
            if (typeof (arguments[arguments.length - 1]) === "function")
            {
                callback = arguments[arguments.length - 1];
            }

            // Are there two extra args?
            if ((arguments.length - 1) > urlArgCount)
            {
                data = arguments[arguments.length - 2];
            }
        }
        
        if (data !== null)
        {
        	this.db.web.ajax(args.method, url, data, function(data) {
                proxiedAfter(data, callback);
            }, function(error) {
                proxiedErrorHandler(callback, error);
            });
        } else
        {
        	this.db.web.ajax(args.method, url, function(data) {
                proxiedAfter(data, callback);
            }, function(error) {
                proxiedErrorHandler(callback, error); 
            });
        }

    };

    return function() {
        this.serviceMethodPreflight(function() {
            before.call(this, neo4j.proxy(resourceFunction, this), arguments);
        }, arguments); 
    };

};

_.extend(neo4j.Service.prototype, {

	/**
	 * Keeps track of if the init method has been called.
	 */
	initialized : false,
	
	/**
	 * Set to true if the service is available, false if not and null if we are
	 * still waiting for the server to tell us.
	 */
	available : null,
	
	/**
	 * Contains URLs to the resources the service provides. This is lazily loaded
	 * when any of the service methods are called.
	 */
	resources : null,
	
	/**
	 * Go through the list of method calls that are waiting for this service to
	 * initialize, and run all of them.
	 */
	handleWaitingCalls : function() {
	
	    for ( var i = 0, l = this.callsWaiting.length; i < l; i++)
	    {
	        try
	        {
	            this.serviceMethodPreflight(this.callsWaiting[i].method,
	                    this.callsWaiting[i].args);
	        } catch (e)
	        {
	            neo4j.log(e);
	        }
	    }
	
	},
	
	/**
	 * Do a GET-request to the root URL for this service, store the result in
	 * this.serviceDefinition.
	 * 
	 * Trigger service.definition.loaded-event on the service-local event handler.
	 */
	loadServiceDefinition : function(callback) {
	    this.get("/", neo4j.proxy(function(data) {
	        this.resources = data.resources;
	        this.trigger("service.definition.loaded", data);
	        callback(data);
	    }, this));
	},
	
	/**
	 * Initialize the service, set the base URL for api calls. <br />
	 * Example: <br />
	 * 
	 * <pre>
	 * var service = new neo4j.Service();
	 * service.init(&quot;http://localhost:9988/backup&quot;);
	 * </pre>
	 * 
	 * @param url
	 *            is the full url to the service (e.g. http://localhost:9988/backup)
	 */
	makeAvailable : function(url) {
	    this.initialized = true;
	    this.available = true;
	    this.url = url;
	    this.handleWaitingCalls();
	},
	
	/**
	 * Tell this service that it is not available from the current server. This will
	 * make the service throw exceptions when someone tries to use it.
	 */
	setNotAvailable : function() {
	    this.initialized = true;
	    this.available = false;
	    this.handleWaitingCalls();
	},
	
	/**
	 * Perform a http GET call for a given resource.
	 * 
	 * @param resource
	 *            is the resource to fetch (e.g. /myresource)
	 * @param data
	 *            (optional) object with data
	 * @param success
	 *            (optional) success callback
	 * @param failure
	 *            (optional) failure callback
	 */
	get : function(resource, data, success, failure) {
	    this.db.web.get(this.url + resource, data, success, failure);
	},
	
	/**
	 * Perform a http DELETE call for a given resource.
	 * 
	 * @param resource
	 *            is the resource to fetch (e.g. /myresource)
	 * @param data
	 *            (optional) object with data
	 * @param success
	 *            (optional) success callback
	 * @param failure
	 *            (optional) failure callback
	 */
	del : function(resource, data, success, failure) {
		this.db.web.del(this.url + resource, data, success, failure);
	},
	
	/**
	 * Perform a http POST call for a given resource.
	 * 
	 * @param resource
	 *            is the resource to fetch (e.g. /myresource)
	 * @param data
	 *            (optional) object with data
	 * @param success
	 *            (optional) success callback
	 * @param failure
	 *            (optional) failure callback
	 */
	post : function(resource, data, success, failure) {
		this.db.web.post(this.url + resource, data, success, failure);
	},
	
	/**
	 * Perform a http PUT call for a given resource.
	 * 
	 * @param resource
	 *            is the resource to fetch (e.g. /myresource)
	 * @param data
	 *            (optional) object with data
	 * @param success
	 *            (optional) success callback
	 * @param failure
	 *            (optional) failure callback
	 */
	put : function(resource, data, success, failure) {
		this.db.web.put(this.url + resource, data, success, failure);
	},
	
	/**
	 * This method is called by all service methods before they do their work. It
	 * will throw an exception if the service is not yet initialized, and it will
	 * throw an exception if the service is not available with the current server.
	 * 
	 * It will also check if a service definition for the given service has been
	 * loaded. If that is not the case, this will be done.
	 * 
	 * If all is well, the callback provided will be called with the correct "this"
	 * context.
	 */
	serviceMethodPreflight : function(callback, args) {
	    
	    if (this.available === false)
	    {
	        throw new Error(
	                "The service you are accessing is not available for this server.");
	    } else if (!this.initialized)
	    {
	        this.callsWaiting.push({
	            'method' : callback,
	            'args' : args
	        });
	        return;
	    }
	
	    args = args || [];
	
	    if (this.resources !== null)
	    {
	        callback.apply(this, args);
	    } else
	    {
	        this.loadServiceDefinition(neo4j.proxy(function() {
	            callback.apply(this, args);
	        }, this));
	    }
	}

});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Allows "taking the pulse" on a graph database, calling registered listeners
 * at regular intervals with monitoring data.
 */
neo4j.GraphDatabaseHeartbeat = function(db) {

    this.db = db;

    /**
     * Quick access to the databases monitor service.
     */
    this.monitor = db.manage.monitor;

    this.listeners = {};
    this.idCounter = 0;
    this.listenerCounter = 0;

    /**
     * These correspond to the granularities available on the server side.
     */
    this.timespan = {
        year : 60 * 60 * 24 * 365,
        month : 60 * 60 * 24 * 31,
        week : 60 * 60 * 24 * 7,
        day : 60 * 60 * 24,
        hours : 60 * 60 * 6,
        minutes : 60 * 35
    };

    /**
     * This is where the monitoring data begins.
     */
    this.startTimestamp = Math.round( (new Date()).getTime() / 1000 ) - this.timespan.year;

    /**
     * This is where the monitoring data ends.
     */
    this.endTimestamp = this.startTimestamp + 1;

    /**
     * List of timestamps, indexes correspond to indexes in data arrays. The is
     * appended as more data is fetched.
     */
    this.timestamps = [];

    /**
     * Sets of data arrays fetched from the server. These are appended to as
     * more data is fetched.
     */
    this.data = {};

    /**
     * Set to true while the server is being polled, used to make sure only one
     * poll is triggered at any given moment.
     */
    this.isPolling = false;

    // Bind these tightly to this object
    this.processMonitorData = neo4j.proxy(this.processMonitorData, this);
    this.beat = neo4j.proxy(this.beat, this);
    this.waitForPulse = neo4j.proxy(this.waitForPulse, this);

    // Start a pulse
    neo4j.setInterval(this.beat, 2000);
};

/**
 * Register a method to be called at regular intervals with monitor data.
 */
neo4j.GraphDatabaseHeartbeat.prototype.addListener = function(listener) {

    this.listenerCounter++;
    this.listeners[this.idCounter++] = listener;

    return this.idCounter;

};

/**
 * Remove a listener.
 * 
 * @param listener
 *            {Integer, Function} either the id returned by {@link #addListener}
 *            or the listener method itself.
 */
neo4j.GraphDatabaseHeartbeat.prototype.removeListener = function(listener) {

    var listenerWasRemoved = false;
    if (typeof (listener) === "function")
    {
        for ( var key in this.listeners)
        {
            if (this.listeners[key] === listener)
            {
                delete this.listeners[key];
                listenerWasRemoved;
                break;
            }
        }
    } else
    {
        if (this.listeners[listener])
        {
            delete this.listeners[listener];
            listenerWasRemoved = true;
        }
    }

    if (listenerWasRemoved)
    {
        this.listenerCounter--;
    }

};

/**
 * Get heartbeat saved data.
 */
neo4j.GraphDatabaseHeartbeat.prototype.getCachedData = function() {
    return {
        timestamps : this.timestamps,
        data : this.data,
        endTimestamp : this.endTimestamp,
        startTimestamp : this.startTimestamp
    };
};

/**
 * Trigger a heart beat.
 */
neo4j.GraphDatabaseHeartbeat.prototype.beat = function() {
    if (this.listenerCounter > 0 && !this.isPolling && this.monitor.available)
    {
        this.isPolling = true;
        this.monitor.getDataFrom(this.endTimestamp, this.processMonitorData);
    }
};

/**
 * Process monitor data, send any new data out to listeners.
 */
neo4j.GraphDatabaseHeartbeat.prototype.processMonitorData = function(data) {
    this.isPolling = false;

    if (data && !data.error)
    {

        var boundaries = this.findDataBoundaries(data);

        // If there is new data
        if (boundaries.dataEnd >= 0)
        {
            this.endTimestamp = data.timestamps[boundaries.dataEnd];

            // Append the new timestamps
            var newTimestamps = data.timestamps.splice(boundaries.dataStart,
                    boundaries.dataEnd - boundaries.dataStart);
            this.timestamps = this.timestamps.concat(newTimestamps);

            // Append the new data
            var newData = {};
            for ( var key in data.data)
            {
                newData[key] = data.data[key].splice(boundaries.dataStart,
                        boundaries.dataEnd - boundaries.dataStart);

                if (typeof (this.data[key]) === "undefined")
                {
                    this.data[key] = [];
                }

                this.data[key] = this.data[key].concat(newData[key]);
            }

            // Update listeners
            var listenerData = {
                server : this.server,
                newData : {
                    data : newData,
                    timestamps : newTimestamps,
                    end_time : this.endTimestamp,
                    start_time : data.start_time
                },
                allData : this.getCachedData()
            };

            this.callListeners(listenerData);

        } else
        {
            // No new data
            this.adjustRequestedTimespan();
        }
    }
};

/**
 * Used to wait for an offline server to come online.
 * 
 * @param callback
 *            {function} Function that will be called when the server is online.
 */
neo4j.GraphDatabaseHeartbeat.prototype.waitForPulse = function(callback) {

    if(!this.pulsePromise) {
        var heartbeat = this,
            getMethod = this.db.get;
        this.pulsePromise = new neo4j.Promise(function(fulfill) {
            var args = { interval : null };
            
            args.interval = neo4j.setInterval(function() {
                getMethod("", function(data) {
                    if( data !== null ) {
                        neo4j.clearInterval(args.interval);
                        heartbeat.pulsePromise = null;
                        fulfill(true);
                    }
                });
            }, 4000);
        });
    }
    
    this.pulsePromise.addFulfilledHandler(callback);
    
    return this.pulsePromise;
    
};

/**
 * This is used to offset a problem with monitor data granularity. This should
 * be the servers concern, but that is not yet implemented.
 * 
 * The monitor data has a concept of granularity - if you ask for a wide enough
 * timespan, you won't get any data back. This is because the data available is
 * to "fine grained" to be visible in your wide time span (e.g. there is data
 * for the last hour, but you asked for data from a full year, the data from
 * a single hour is not considered reliable when looking at such a large time 
 * span).
 * 
 * This creates a problem since there might be data for a full year, and we'd
 * like to show that. So what we do is, we ask for a year. If we get an empty 
 * result, this method will make the timespan we ask for smaller and smaller, 
 * until we get start getting data back from the server.
 * 
 * @return {object} An object with a dataStart and a dataEnd key.
 */
neo4j.GraphDatabaseHeartbeat.prototype.adjustRequestedTimespan = function(data) {
    var now = Math.round((new Date()).getTime() / 1000);
    var timespan = now - this.endTimestamp;

    if (timespan >= this.timespan.year)
    {
        this.endTimestamp = now - this.timespan.month;
        this.beat();
    } else if (timespan >= this.timespan.month)
    {
        this.endTimestamp = now - this.timespan.week;
        this.beat();
    } else if (timespan >= this.timespan.week)
    {
        this.endTimestamp = now - this.timespan.day;
        this.beat();
    } else if (timespan >= this.timespan.day)
    {
        this.endTimestamp = now - this.timespan.hours;
        this.beat();
    } else if (timespan >= this.timespan.day)
    {
        this.endTimestamp = now - this.timespan.minutes;
        this.beat();
    }
};

/**
 * Find the first and last index that contains a number in a given array. This
 * is used because the monitor service returns "pads" its result with NaN data
 * if it is asked for data it does not have.
 * 
 * @param data
 *            {object} Should be the data object returned by the monitor
 *            services methods.
 * @return {object} An object with a dataStart and a dataEnd key.
 */
neo4j.GraphDatabaseHeartbeat.prototype.findDataBoundaries = function(data) {

    var firstKey = this.getFirstKey(data);

    var lastIndexWithData = -1, firstIndexWithData = -1;

    if (firstKey)
    {

        // Find the last timestamp that has any data associated with it
        for (lastIndexWithData = data.timestamps.length - 1; lastIndexWithData >= 0; lastIndexWithData--)
        {
            if (typeof (data.data[firstKey][lastIndexWithData]) === "number")
            {
                break;
            }
        }

        // Find the first timestamp that has any data associated with it
        for (firstIndexWithData = 0; firstIndexWithData <= lastIndexWithData; firstIndexWithData++)
        {
            if (typeof (data.data[firstKey][firstIndexWithData]) === "number")
            {
                break;
            }
        }
    }

    return {
        dataStart : firstIndexWithData,
        dataEnd : lastIndexWithData
    };

};

/**
 * Call all listeners with some data.
 */
neo4j.GraphDatabaseHeartbeat.prototype.callListeners = function(data) {
    for ( var i in this.listeners)
    {
        setTimeout(function(listener) {
            return function() {
                listener(data);
            }
        }(this.listeners[i]), 0);
    }
};

/**
 * Return the first key encountered in some object, or null if none is
 * available.
 */
neo4j.GraphDatabaseHeartbeat.prototype.getFirstKey = function(object) {
    if (typeof (object) === "object")
    {
        for ( var key in object.data)
        {
            break;
        }
    }

    return key ? key : null;
};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @namespace namespace containing data models.
 */
neo4j.models = neo4j.models || {};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Represents a server-side JMX Bean.
 * 
 * Each bean has an attribute map, containing the actual
 * JMX data, and a property map, which contains data parsed
 * from the JMX Bean name.
 * 
 * Each bean also has a domain attribute, which is a string
 * representation of the JMX domain.
 */
neo4j.models.JMXBean = function(data) {
	
	this.parse(data);
	
};

/**
 * Parse server-provided JSON data and use it to populate this model.
 */
neo4j.models.JMXBean.prototype.parse = function(bean) {
	
	var parsedNameMap = this.parseName(bean.name);
	
	this.domain = parsedNameMap.domain;
	delete(parsedNameMap.domain); // We don't want this in the properties map.
	
	this.properties = parsedNameMap;
	this.attributes = bean.attributes;
	this.description = bean.description;
	this.jmxName = bean.name;
	
};

/**
 * Get a name for this bean. This will check if there is a name property
 * in the beanname (ie. some.domain:type=MemoryManager,name=CodeCacheManager ),
 * and return that. If none is available, it will return the first property,
 * and as a last resort, it will return the raw jmx name.
 */
neo4j.models.JMXBean.prototype.getName = function(bean) {
	if ( this.properties['name'] ) {
		return this.properties['name'];
	} else {
		for(var name in this.properties) {
			return this.properties[name];
		}
	}
	
	return this.jmxName;
};

/**
 * Parse jmx beanname ( something like some.domain:type=MemoryManager,name=CodeCacheManager ).
 */
neo4j.models.JMXBean.prototype.parseName = function(name) {
	
	var parts = name.split(":"),
	    part, domain,
	    parsed = {};
	
	domain = parts[0];
	parts = parts[1].split(",");
	
	for(var i = 0, l=parts.length; i<l; i++) {
		part = parts[i].split("=");
		parsed[part[0]] = part[1];
	}
	
	parsed.domain = domain;
	
	return parsed;
	
};

/**
 * Get an attribute by name.
 * 
 * @return an attribute object, or null if none is found.
 */
neo4j.models.JMXBean.prototype.getAttribute = function(name) {
	var search = name.toLowerCase();
	for( var i=0,l=this.attributes.length; i<l; i++ ) {
		if( this.attributes[i].name.toLowerCase() === search ) {
			return this.attributes[i];
		}
	}
	
	return null;
};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Contains methods shared by nodes and relationships.
 */
neo4j.models.PropertyContainer = function() {
	
	_.bindAll(this, 'getSelf', 'exists', 'getProperty', 'setProperty', 'getProperties', 'setProperties');
	
	this._data = this._data || {};
	
};

_.extend(neo4j.models.PropertyContainer.prototype, {
	
    /**
     * Get the identifier (url) for this object. Will return null if 
     * the object is not yet saved.
     */
    getSelf : function()
    {
        return typeof(this._self) != "undefined" ? this._self : null;
    },
    
    /**
     * Get the numeric id for this object. Returns null if
     * the object is not yet saved.
     */
    getId : function() {
        var url = this.getSelf();
        return url == null ? null : url.substr(url.lastIndexOf("/")+1);
    },
    
    /**
     * @return true if this object has a url.
     */
    exists : function() {
        return this.getSelf() !== null;
    },
    
    /**
     * Check if a property exists.
     */
    hasProperty : function(key) {
       return key in this._data; 
    },
    
	/**
	 * Get a property by key.
	 */
	getProperty : function(key) {
	    return this._data[key] || null;
	},
	
	/**
	 * Set a property.
	 */
	setProperty : function(key, value) {
	    this._data[key] = value;
	},
	
	/**
	 * Get all properties.
	 * @return Map of all properties
	 */
	getProperties : function() {
	    return this._data;
	},
	
	/**
	 * Set several properties at once.
	 */
	setProperties : function(properties) {
	    this._data = _.extend(this._data, properties);
	},
	
	/**
	 * Remove a property.
	 */
	removeProperty : function(key) {
	    delete(this._data[key]);
	}
	
});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Represents a database node.
 * 
 * @class
 * @extends neo4j.models.PropertyContainer
 * @param arg
 *            Is either a node url or, to create a new node, a map.
 */
neo4j.models.Node = function(arg, db)
{

    neo4j.models.PropertyContainer.call(this);
   
    this.db = db;
    this._init(arg);

    _.bindAll(this, 'save', 'fetch', 'getRelationships', '_init');

};

neo4j.models.Node.IN = "in";
neo4j.models.Node.OUT = "out";
neo4j.models.Node.ALL = "all";

// Defined here until we break out a proper traversal subsystem
neo4j.traverse = {};
neo4j.traverse.RETURN_NODES = "node";
neo4j.traverse.RETURN_RELATIONSHIPS = "relationship";
neo4j.traverse.RETURN_PATHS = "path";

_.extend(neo4j.models.Node.prototype, neo4j.models.PropertyContainer.prototype,

    /** @lends neo4j.models.Node# */        
    {

    /**
     * Save this node. Creates the node if it does not have a url.
     * 
     * @return A {@link neo4j.Promise} for a saved node.
     */
    save : function()
    {
        var node = this, web = this.db.web;
        if ( ! this.exists() )
        {
            return new neo4j.Promise(function(fulfill, fail)
            {
                node.db.getServiceDefinition().then(function(dbDefinition) {
                    web.post(dbDefinition.node, node._data).then(function(response) {
                        node._init(response.data);
                        fulfill(node);
                    }, fail);
                }, fail);
            });
        } else
        {
            return new neo4j.Promise(function(fulfill, fail)
            {
                web.put(node._urls.properties, node.getProperties(), function(){
                    fulfill(node);
                }, fail);
            });
        }
    },

    /**
     * Fetch data for this node. Use to populate a node that only has a _self
     * url, or to refresh the data in the node.
     * 
     * @return A {@link neo4j.Promise} of a populated node.
     */
    fetch : function()
    {
        var node = this, web = this.db.web;
        return new neo4j.Promise(function(fulfill, fail)
        {
            web.get(node._self).then(function(response)
            {
                if(response.data && response.data.self) {
                    node._init(response.data);
                    fulfill(node);
                } else {
                    fail(new neo4j.exceptions.InvalidDataException());
                }
            }, function(err) {
                fail(new neo4j.exceptions.NotFoundException(node._self));
            });
        });
    },
    
    /**
     * Remove this node.
     * @return A promise that will be fulfilled when the node is deleted.
     */
    remove : function() {
        var node = this, web = this.db.web, hasDeletedRelationships = false,
            db = this.db, nodeUrl = node.getSelf();
        
        return new neo4j.Promise(function(fulfill, fail) {
            web.del(node.getSelf()).then(function() {
                db.getReferenceNodeUrl().then(function(url) {
                    if(url == nodeUrl) {
                        db.forceRediscovery();
                    }
                    fulfill(true);
                }, fail);
            }, function(response) {
                if(response.error.isConflict() && !hasDeletedRelationships) {
                    // Need to remove relationships
                    node.getRelationships().then(function(rels) {
                        _.each(rels, function(rel) {
                            rel.remove();
                        });
                        
                        // Ensure we don't end up in recursive loop
                        hasDeletedRelationships = true;
                        node.remove().then(function() {
                            fulfill(true);
                        }, fail);
                    }, fail);
                }
            });
        });
    },
    
    getCreateRelationshipUrl : function() {
        if(this.exists()) {
            return this._urls.create_relationship;
        } else {
            throw new Error("You can't get the create relationship url until you have saved the node!");
        }
    },

    /**
     * Perform a traversal starting from this node.
     * @param traversal should be a map conforming to http://components.neo4j.org/neo4j-server/snapshot/rest.html#Traverse
     * @param returnType (optional) One of:
     *                   neo4j.traverse.RETURN_NODES (default)
     *                   neo4j.traverse.RETURN_RELATIONSHIPS
     *                   neo4j.traverse.RETURN_PATHS
     * @return A promise for an array of whatever type you asked for.
     */
    traverse : function(traversal, returnType) {
        returnType = returnType || neo4j.traverse.RETURN_NODES
        var url = this.db.web.replace(this._urls['traverse'], {'returnType' : returnType}),
            node = this,
            modelClass;

        switch(returnType) {
          case neo4j.traverse.RETURN_RELATIONSHIPS:
            modelClass = neo4j.models.Relationship;
            break;
          case neo4j.traverse.RETURN_PATHS:
            modelClass = neo4j.models.Path;
            break;
          default:
            modelClass = neo4j.models.Node;
            break;
        }

        return new neo4j.Promise(function(fulfill, fail) {
            node.db.web.post(url, traversal).then(function(response) {
                var instances = _.map( response.data, function(r) { 
                    return new modelClass(r, node.db);
                });
                fulfill(instances);
            }, fail);
        });
    },
    
    /**
     * Get relationships in some given direction for this node.
     * @param dir (optional) One of {@link neo4j.models.Node.IN}, {@link neo4j.models.Node.OUT}, {@link neo4j.models.Node.ALL}.
     * @param types (optional) A single string or an array of strings. 
     * @return A promise for an array of relationships.
     */
    getRelationships : function(dir, types) {
        var dir = dir || neo4j.models.Node.ALL,
            types = types || null,
            node = this,
            url;
        
        var hasTypes = types ? true : false;
        
        if(_.isArray(types)) {
            types = types.join("&");
        }
        
        switch(dir) {
        case neo4j.models.Node.IN:
            url = hasTypes ? this._urls['incoming_typed_relationships'] : 
                             this._urls['incoming_relationships'];
            break;
        case neo4j.models.Node.OUT:
            url = hasTypes ? this._urls['outgoing_typed_relationships'] : 
                             this._urls['outgoing_relationships'];
            break;
        default:
            url = hasTypes ? this._urls['all_typed_relationships'] : 
                             this._urls['all_relationships'];
            break;
        }
        
        if(hasTypes) {
            url = this.db.web.replace(url, {'-list|&|types' : types});
        }
        
        return new neo4j.Promise(function(fulfill, fail) {
            node.db.web.get(url).then(function(response) {
                var instances = _.map(
                        response.data, 
                        function(r) { 
                            return new neo4j.models.Relationship(r, node.db);
                        });
                fulfill(instances);
            }, fail);
        });
    },

    /**
     * Used to initialize a node object from json data recieved from a neo4j
     * server.
     */
    _init : function(definition)
    {
        this._self = definition.self || null;
        this._data = definition.data || {};
        
        this._urls = {
            'properties' : definition.properties || "",
            'traverse' : definition.traverse || "",
            'create_relationship' : definition.create_relationship || "",
            'all_relationships' : definition.all_relationships || "",
            'all_typed_relationships' : definition.all_typed_relationships || "",
            'incoming_relationships' : definition.incoming_relationships || "",
            'incoming_typed_relationships' : definition.incoming_typed_relationships || "",
            'outgoing_relationships' : definition.outgoing_relationships || "",
            'outgoing_typed_relationships' : definition.outgoing_typed_relationships || ""
        };
        
    }

});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Represents a database relationship.
 * 
 * 
 * @class
 * @extends neo4j.models.PropertyContainer
 * 
 * @param arg Should be an object matching that returned by neo4j server
 * when fetching or creating relationships. If you are fetching a relationship,
 * only the "self" parameter is required. Call #fetch() to load the rest of the
 * data. 
 * 
 * If you are creating a relationship, the attributes "start", "end" and "type"
 * are required. Start and end can either be urls or Node objects. Call #save() 
 * to create the relationship.
 */
neo4j.models.Relationship = function(arg, db) {
	
	neo4j.models.PropertyContainer.call(this);
	
	this.db = db;
    this._init(arg);

    _.bindAll(this, 'save', 'fetch', '_init');
	
};

_.extend(neo4j.models.Relationship.prototype, neo4j.models.PropertyContainer.prototype, 

    /** @lends neo4j.models.Relationship# */       
    {
	
    /**
     * Save this relationship. Creates the relationship if it does not have a url.
     * 
     * @return A {@link neo4j.Promise} for a saved relationship.
     */
    save : function()
    {
        var rel = this, web = this.db.web;
        if ( ! this.exists() )
        {
            return this.getStartNode().then(function(node, fulfill, fail) {
                var req = web.post(node.getCreateRelationshipUrl(), {
                    to: rel._endUrl, 
                    type: rel.getType(), 
                    data: rel.getProperties()});
               
                req.then(function(response) {
                    rel._init(response.data);
                    fulfill(rel);
                }, function(response) {
                    if(response.error 
                       && response.error.data 
                       && response.error.data.exception) { 
                       var ex = response.error.data.exception;
                       if(ex.indexOf("EndNodeNotFoundException") > -1 
                          || (ex.indexOf("BadInputException") > -1 && ex.indexOf(rel._endUrl) > -1) ) {
                         return fail(new neo4j.exceptions.NotFoundException(rel._endUrl));
                       } else if (ex.indexOf("StartNodeSameAsEndNodeException") > -1) {
                         return fail(new neo4j.exceptions.StartNodeSameAsEndNodeException(rel._endUrl));
                       }
                    } 
                    
                    fail(response);
                });
            });
        } else
        {
            return new neo4j.Promise(function(fulfill, fail)
            {
                web.put(rel._urls.properties, rel.getProperties()).then(function(){
                    fulfill(rel);
                }, fail);
            });
        }
    },

    /**
     * Fetch data for this relationship. Use to populate a relationship that only has a _self
     * url, or to refresh the data.
     * 
     * @return A {@link neo4j.Promise} of a populated relationship.
     */
    fetch : function()
    {
        var rel = this, web = this.db.web;
        return new neo4j.Promise(function(fulfill, fail)
        {
            web.get(rel._self).then(function(response) {
                if(response.data && response.data.self && response.data.start && response.data.end) {
                    rel._init(response.data);
                    fulfill(rel);
                } else {
                    fail(new neo4j.exceptions.InvalidDataException());
                }
            }, fail);
        });
    },
    
    /**
     * Remove this relationship.
     * @return A promise that will be fulfilled when the relationship
     *         is removed.
     */
    remove : function() {
        var rel = this, web = this.db.web;
        return new neo4j.Promise(function(fulfill, fail) {
            web.del(rel.getSelf()).then(function() {
                fulfill(true);
            }, fail);
        });
    },
    
    /**
     * Get the type of this relationship.
     */
    getType : function() {
        return this._type || null;
    },
    
    /**
     * Get a promise for the node this relationship originates from.
     */
    getStartNode : function() {
        return this._getNode("_startNode", "_startUrl");
    },
    
    /**
     * Fetches the url for the start node. Use this to avoid extra calls
     * to the server if you only need this url.
     */
    getStartNodeUrl : function() {
        return this._startUrl;
    },
    
    /**
     * Check if a node is the start node for this relationship.
     * @param String url or a node object
     * @return boolean
     */
    isStartNode : function(node) {
        if( node instanceof neo4j.models.Node ) {
            return this._startUrl === node.getSelf();  
        } else {
            return this._startUrl === node;
        }
    },
    
    /**
     * Get a promise for the node this relationship ends at.
     */
    getEndNode : function() {
        return this._getNode("_endNode", "_endUrl");
    },
    
    /**
     * Fetches the url for the end node. Use this to avoid extra calls
     * to the server if you only need this url.
     */
    getEndNodeUrl : function() {
        return this._endUrl;
    },
    
    /**
     * Check if a node is the end node for this relationship.
     * @param String url or a node object
     * @return boolean
     */
    isEndNode : function(node) {
        if( node instanceof neo4j.models.Node ) {
            return this._endUrl === node.getSelf();  
        } else {
            return this._endUrl === node;
        }
    },
    
    /**
     * If provided the end node (or end node url) return promise
     * for start node. If provided start node, return promise for end node.
     */
    getOtherNode : function(node) {
        if(this.isStartNode(node)) {
            return this.getEndNode();
        } else {
            return this.getStartNode();
        }
    },
    
    /**
     * If provided the end node (or end node url) return url
     * for start node. If provided start node, return url for end node.
     */
    getOtherNodeUrl : function(node) {
        if(this.isStartNode(node)) {
            return this.getEndNodeUrl();
        } else {
            return this.getStartNodeUrl();
        }
    },
    
    /**
     * Get a promise for a node, given a property where the node should
     * be cached, and a property where we can find the url of the node
     * if it is not cached.
     */
    _getNode : function(nodeAttribute, urlAttribute) {
        if( typeof(this[nodeAttribute]) != "undefined" ) {
            return neo4j.Promise.fulfilled(this[nodeAttribute]);
        } else {
            var rel = this;
            return this.db.node(this[urlAttribute]).then(function(node, fulfill) {
                rel[nodeAttribute] = node;
                fulfill(node);
            });
        }
    },

    /**
     * Used to initialize a relationship object from json data recieved from a neo4j
     * server.
     */
    _init : function(definition)
    {
        this._self = definition.self || null;
        this._data = definition.data || {};
        this._type = definition.type || null;
        
        this._urls = {
            'properties' : definition.properties || ""      
        };
        
        if( typeof(definition.start) != "undefined" ) {
            if( definition.start instanceof neo4j.models.Node) {
                this._startNode = definition.start;
                this._startUrl = definition.start.getSelf();
            } else {
                this._startUrl = definition.start;
            }
        }
        
        if( typeof(definition.end) != "undefined" ) {
            if( definition.end instanceof neo4j.models.Node) {
                this._endNode = definition.end;
                this._endUrl = definition.end.getSelf();
            } else {
                this._endUrl = definition.end;
            }
        }
    }
});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Represents a path through the graph.
 */
neo4j.models.Path = function(arg, db) {
	
    this.db = db;
    this._init(arg);

    _.bindAll(this, '_init');
	
};

_.extend(neo4j.models.Path.prototype, {

    /**
     * Used to initialize a path object from json data recieved from a neo4j
     * server.
     */
    _init : function(definition)
    {
        this._start  = definition.start;
        this._end    = definition.end;
        this._length = definition.length;
        
        this._nodeUrls = definition.nodes;
        this._relationshipUrls = definition.relationships;
    }
});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @namespace cypher.
 */
neo4j.cypher = neo4j.cypher || {};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Cypher query execution.
 * 
 * @class
 * @param db Should be a GraphDatabase instance.
 */
neo4j.cypher.ExecutionEngine = function(db)
{

    /**
     * A GraphDatabase instance.
     */
    this.db = db;
    
};

_.extend(neo4j.cypher.ExecutionEngine.prototype,
        
    /** @lends neo4j.cypher.ExecutionEngine# */          
    {

        execute : function(query) {
            var self = this;
            return this.db.getServiceDefinition().then(function(urls, fulfill, fail) {
                self.db.web.post(urls['cypher'], {query:query}, function(result) {
                    fulfill(new neo4j.cypher.QueryResult(self.db, result));
                }, fail);
            });
        }
    
    }
);
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * QueryResult row.
 * 
 * @class
 * @param db Should be a GraphDatabase instance.
 * @param row Should be an array of raw values for this row.
 * @param columnMap Should be a lookup table for column -> row index
 */
neo4j.cypher.ResultRow = function(db, row, columnMap)
{

    /**
     * A GraphDatabase instance.
     */
    this.db = db;
    
    /**
     * The raw server result
     */
    this.row = row;
    
    /**
     * A lookup table for columns
     */
    this.columnMap = columnMap;
    
    this.pointer = 0;
    
};

_.extend(neo4j.cypher.ResultRow.prototype,
        
    /** @lends neo4j.cypher.ResultRow# */          
    {

        size : function() {
            return this.row.length;
        },
        
        getByIndex : function(index) {
            return this._convertValue(this.row[index]);
        },
        
        get : function(name) {
            return this.getByIndex(this.columnMap[name]);
        },
        
        next : function() {
            return this.getByIndex(this.pointer++);
        },
        
        hasNext : function() {
            return this.pointer < this.size();
        },
        
        reset : function() {
            this.pointer = 0;
        },
        
        _convertValue : function(value) {
            if(value === null) {
                return null;
            } else if( typeof(value.data) !== "undefined") {
                if(typeof(value.type) !== "undefined") { // Relationship
                    return new neo4j.models.Relationship(value, this.db);
                } else if(typeof(value.length) !== "undefined") { // Path 
                    // TODO
                    return JSON.stringify(value);
                } else { // Node
                    return new neo4j.models.Node(value, this.db);
                }
            } else {
                return value;
            }
        }
    
    }
);
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Cypher query execution.
 * 
 * @class
 * @param db Should be a GraphDatabase instance.
 * @param rawResult Should be the raw result returned by the server.
 */
neo4j.cypher.QueryResult = function(db, rawResult)
{

    /**
     * A GraphDatabase instance.
     */
    this.db = db;
    
    /**
     * The raw server result
     */
    this.data = rawResult.data;
    
    /**
     * An aaray of column names
     */
    this.columns = rawResult.columns;
    
    this.pointer = 0;
    
    this.columnMap = {};
    for(var i=0;i<this.columns.length;i++) {
        this.columnMap[this.columns[i]] = i;
    }
    
};

_.extend(neo4j.cypher.QueryResult.prototype,
        
    /** @lends neo4j.cypher.QueryResult# */          
    {

        size : function() {
            return this.data.length;
        },
        
        next : function() {
            return new neo4j.cypher.ResultRow(this.db, this.data[this.pointer++], this.columnMap);
        },
        
        hasNext : function() {
            return this.pointer < this.size();
        },
        
        reset : function() {
            this.pointer = 0;
        }
    
    }
);
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @class Interface to the backup functionality of the REST server.
 * @extends neo4j.Service
 * @param db
 *            should be a neo4j.GraphDatabase object
 */
neo4j.services.BackupService = function(db) {

	neo4j.Service.call(this,db);

};

_.extend(neo4j.services.BackupService.prototype, neo4j.Service.prototype);

/**
 * Trigger a manual backup to the manual backup path defined in the server
 * settings.
 * 
 * @param callback
 *            will be called when the backup is completed
 * @function
 */
neo4j.services.BackupService.prototype.triggerManual = neo4j.Service
        .resourceFactory({
            'resource' : 'trigger_manual',
            'method' : 'POST',
            'errorHandler' : function(callback, error) {
                if (error.exception == "NoBackupFoundationException")
                {
                    callback(false);
                }
            }
        });

/**
 * Trigger backup foundation on the currently configured manual backup path.
 * 
 * @param callback
 *            will be called when the foundation is done
 * @function
 */
neo4j.services.BackupService.prototype.triggerManualFoundation = neo4j.Service
        .resourceFactory({
            'resource' : 'trigger_manual_foundation',
            'method' : 'POST'
        });

/**
 * Get a list of scheduled backup jobs and their latest logs.
 * 
 * @param callback
 *            will be called with the list
 * @function
 */
neo4j.services.BackupService.prototype.getJobs = neo4j.Service
        .resourceFactory({
            'resource' : 'jobs',
            'method' : 'GET'
        });

/**
 * Get a single job by id
 * 
 * @param id
 *            is the id of the job
 * @param callback
 *            will be called with the job
 * @function
 */
neo4j.services.BackupService.prototype.getJob = function(id, callback) {
    this.getJobs(function(jobs) {
        for ( var i in jobs.jobList)
        {
            if (jobs.jobList[i].id == id)
            {
                callback(jobs.jobList[i]);
                return;
            }
        }

        callback(null);
    });
};

/**
 * Delete a backup job
 * 
 * @param id
 *            the id of the job
 * @param callback
 *            will be called when scheduled job is deleted
 * @function
 */
neo4j.services.BackupService.prototype.deleteJob = neo4j.Service
        .resourceFactory({
            'resource' : 'job',
            'method' : 'DELETE',
            'urlArgs' : [ "id" ]
        });

/**
 * Trigger foundation for a given scheduled job.
 * 
 * @param id
 *            the id of the job
 * @param callback
 *            will be called when the foundation is done
 * @function
 */
neo4j.services.BackupService.prototype.triggerJobFoundation = neo4j.Service
        .resourceFactory({
            'resource' : 'trigger_job_foundation',
            'method' : 'POST',
            'urlArgs' : [ "id" ]
        });

/**
 * Create or edit a job schedule. If you supply an id in the job object, this
 * will edit that job. If you omit the id, a new job is created.
 * 
 * @param job
 *            A job JSON object. <br />
 *            This should look like:
 * 
 * <pre>
 * {
 *     'id' : 12,
 *     'name' : &quot;Daily backups&quot;,
 *     'backupPath' : &quot;/var/backup&quot;,
 *     'cronExpression' : &quot;0 0 12 * * ? *&quot;,
 *     'autoFoundation' : true
 * }
 * </pre>
 * 
 * @param callback
 *            will be called when the action is complete.
 * @function
 */
neo4j.services.BackupService.prototype.setJob = neo4j.Service.resourceFactory({
    'resource' : 'jobs',
    'method' : 'PUT'
});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @class Interface to the config functionality of the REST server.
 * @extends neo4j.Service
 * @param db
 *            should be a neo4j.GraphDatabase object
 */
neo4j.services.ConfigService = function(db) {

	neo4j.Service.call(this,db);

};

_.extend(neo4j.services.ConfigService.prototype, neo4j.Service.prototype);

/**
 * Get a list of all available properties.
 * 
 * @param callback
 *            will be called with the list of properties
 * @function
 */
neo4j.services.ConfigService.prototype.getProperties = neo4j.Service
        .resourceFactory({
            'resource' : 'properties',
            'method' : 'GET',
            'before' : function(method, args) {
                
                var callback = args[0];
                
                method(function(data) {
                    // Convert array of objects to map
                    var props = {};
                    for(var i in data) {
                        props[data[i].key] = data[i];
                    }
                    
                    callback(props);
                });
            }
        });

/**
 * Fetch a specific property
 * 
 * @param key
 *            is the property key
 * @param callback
 *            will be called with the property
 */
neo4j.services.ConfigService.prototype.getProperty = function(key, callback) {
    this.getProperties(function(properties){
       for(var propKey in properties) {
           if(propKey === key ) {
               callback(properties[propKey]);
               return;
           }
       } 
       
       callback(null);
    });
};

/**
 * Set several settings at once. This will restart the server and/or the JVM as
 * appropriate.
 * 
 * @param settings
 *            should be a string map. Each key should map to a property key, and
 *            the value should be the new value of that property.
 * @param callback
 *            will be called when the foundation is done
 * @function
 */
neo4j.services.ConfigService.prototype.setProperties = neo4j.Service
        .resourceFactory({
            'resource' : 'properties',
            'method' : 'POST',
            'before' : function(method, args) {
                
                // Convert map to array of objects
                var props = [];
                var prop;
                for ( var key in args[0])
                {
                    prop = {
                        key : key,
                        value : args[0][key]
                    };
                    props.push(prop);
                    this.db.trigger("config.property.set", prop);
                }

                method(props, args[1]);
            }
        });

/**
 * Set a specific property
 * 
 * @param key
 *            is the property key
 * @param value is the value to set the property to
 * @param callback
 *            will be called with the property
 */
neo4j.services.ConfigService.prototype.setProperty = function(key, value, callback) {
    var props = {};
    props[key] = value;
    this.setProperties(props, callback);
};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Allows importing a graphml file from a URL. The server also supports html
 * file uploads.
 * 
 * To use that, create a form like so:
 * 
 * <pre>
 * &lt;form action=&quot;[GET PATH VIA {@link #getUploadPath}]&quot; method=&quot;POST&quot; enctype=&quot;multipart/form-data&quot;&gt;
 *    &lt;input type=&quot;hidden&quot; name=&quot;redirect&quot; value=&quot;[REDIRECT TO HERE AFTER IMPORT]&quot; /&gt;
 *    &lt;input type=&quot;file&quot; name=&quot;file&quot; /&gt;
 *    &lt;input type=&quot;submit&quot; value=&quot;Import&quot; /&gt;
 * &lt;/form&gt;
 * </pre>
 * 
 * You can get the URL you should post the form to via {@link #getUploadPath}.
 * 
 * @class Interface to the import functionality of the REST server.
 * @extends neo4j.Service
 * @param db
 *            should be a neo4j.GraphDatabase object
 */
neo4j.services.ImportService = function(db) {

	neo4j.Service.call(this,db);

};

_.extend(neo4j.services.ImportService.prototype, neo4j.Service.prototype);

/**
 * Import graphml data from a url.
 * 
 * @param url
 *            is the url to load the graphml file from
 * @param callback
 *            will be called when the import is complete
 * @function
 */
neo4j.services.ImportService.prototype.fromUrl = neo4j.Service
    .resourceFactory({
        'resource' : 'import_from_url',
        'method' : 'POST',
        'before': function(method, args) {
            method({'url' : args[0]}, args[1]);
        }
    }
);

/**
 * Get the URL to post file uploads to. See the class constructor for info on
 * how the upload form should look.
 * 
 * @param callback
 *            will be called with the url as parameter
 */
neo4j.services.ImportService.prototype.getUploadUrl = function(cb) {
    this.serviceMethodPreflight(function(cb) {
        cb(this.resources['import_from_file']);
    }, arguments); // End preflight
};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @class Interface to the export functionality of the REST server.
 * @extends neo4j.Service
 * @param db
 *            should be a neo4j.GraphDatabase object
 */
neo4j.services.ExportService = function(db) {

	neo4j.Service.call(this,db);

};

_.extend(neo4j.services.ExportService.prototype, neo4j.Service.prototype);

/**
 * Export all nodes, properties and relationships.
 * 
 * @param callback
 *            will be called with an object with a single property, "url", the
 *            value of which is a URL where you can download the export.
 * @function
 */
neo4j.services.ExportService.prototype.all = neo4j.Service
    .resourceFactory({
        'resource' : 'export_all',
        'method' : 'POST'
    }
);
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @class Interface to the console functionality of the REST server.
 * @extends neo4j.Service
 * @param db
 *            should be a neo4j.GraphDatabase object
 */
neo4j.services.ConsoleService = function(db) {

	neo4j.Service.call(this,db);

};

_.extend(neo4j.services.ConsoleService.prototype, neo4j.Service.prototype);

/**
 * Execute a command
 * 
 * @param cmd
 *            string command to execute.
 * @param engine
 *            engine to use to run script
 * @param callback
 *            will be called with the result
 * @function
 */
neo4j.services.ConsoleService.prototype.exec = neo4j.Service
    .resourceFactory({
        'resource' : 'exec',
        'method' : 'POST',
        'before': function(method, args) {
            method({
            	'command' : args[0],
            	'engine' : args[1]
            	}, args[2]);
        }
    }
);
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @class Interface to the jmx exposing functionality of the REST server.
 * @extends neo4j.Service
 * @param db
 *            should be a neo4j.GraphDatabase object
 */
neo4j.services.JmxService = function(db) {

	neo4j.Service.call(this,db);

    // Kernelinstance gets called a lot, cache each result for two seconds
    this.kernelInstance = neo4j.cachedFunction( this.kernelInstance, 0, 2000);
    
};

_.extend(neo4j.services.JmxService.prototype, neo4j.Service.prototype);

/**
 * Get a list of all jmx domains available
 * 
 * @param callback
 *            will be called with the list of domains
 * @function
 */
neo4j.services.JmxService.prototype.getDomains = neo4j.Service
        .resourceFactory({
            'resource' : 'domains',
            'method' : 'GET'
        });

/**
 * Get a domain and all the beans in it.
 * 
 * @param domain
 *            {String} Name of the domain
 * @param callback
 *            will be called with the domain data
 * @function
 */
neo4j.services.JmxService.prototype.getDomain = neo4j.Service.resourceFactory({
    'resource' : 'domain',
    'method' : 'GET',
    'urlArgs' : [ 'domain' ],
    'after' : function(data, callback) {
    	var betterBeans = [];
    	for (var i=0,l=data.beans; i<l; i++) {
    		betterBeans.push( new neo4j.models.JMXBean(data.beans[i]) );
    	}
    	
    	data.beans = betterBeans;
    	callback(data);
    }
});

/**
 * Get a specific JMX bean.
 * 
 * @param domain
 *            {String} Name of the domain OR the "magic" domain "neo4j". The
 *            latter will automatically trigger a call to
 *            {@link #kernelInstance} and use the result of that to get your
 *            bean. Use something like neo4j:Configuration to get the current
 *            configuration bean.
 * @param objectName
 *            {String} ObjectName of the bean
 * @param callback
 *            will be called with the bean
 * @function
 */
neo4j.services.JmxService.prototype.getBean = neo4j.Service.resourceFactory({
    'resource' : 'bean',
    'method' : 'GET',
    'urlArgs' : [ 'domain', 'objectName' ],
    'before' : function(method, args) {
        if (args[0] === "neo4j")
        {
            var me = this,
                name = args[1],
                callback = args[2];
            this.kernelInstance(function(instanceName) {
                var args = ["org.neo4j", escape(instanceName + ",name=" + name), callback];
                method.apply(this, args);
            });
        } else
        {
            args[0] = escape(args[0]);
            args[1] = escape(args[1]);
            method.apply(this, args);
        }
    },
	'after' : function(data, callback) {
		if (data.length > 0) {
			callback(new neo4j.models.JMXBean(data[0]));
		} else {
			callback(null);
		}
	}
});

/**
 * Search for jmx beans
 * 
 * @param queries
 *            {Array} An array of strings, together they form an OR query
 * @param callback
 *            will be called with the list of beans
 * @function
 */
neo4j.services.JmxService.prototype.query = neo4j.Service.resourceFactory({
    'resource' : 'query',
    'method' : 'POST',
    'after' : function(data, callback) {
    	var betterBeans = [];
    	for (var i=0,l=data.length; i<l; i++) {
    		betterBeans.push( new neo4j.models.JMXBean(data[i]) );
    	}
    	callback(betterBeans);
    }
});

/**
 * Since there may be several Neo4j database running in the same JVM, you can
 * use this method to find out which one of them is the one running behind the
 * REST server.
 * 
 * @param callback
 *            will be called with a JMX query that would return all beans for
 *            the current REST kernel, <br/> Example:
 * 
 * <pre>
 *            org.neo4j:instance=kernel#0,name=*
 * </pre>
 * 
 * @function
 */
neo4j.services.JmxService.prototype.kernelInstance = function(callback) {
    var web = this.db.web;
    this.serviceMethodPreflight(function(callback) {
        var url = this.resources['kernelquery'];
        web.get(url, function(data) {

            // Data looks like : org.neo4j:instance=kernel#0,name=*
            // Split it to be: instance=kernel#0
            var result = data ? data.split(":")[1].split(",")[0] : null;

            callback(result);

        });
    }, [ callback ]);
};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @class Interface to the lifecycle functionality of the REST server.
 * @extends neo4j.Service
 * @param db
 *            should be a neo4j.GraphDatabase object
 */
neo4j.services.LifecycleService = function(db) {

	neo4j.Service.call(this,db);

};

_.extend(neo4j.services.LifecycleService.prototype, neo4j.Service.prototype);

/**
 * Get the current lifecycle status of the server.
 * 
 * @param callback
 *            will be called with lifecycle status information
 * @function
 */
neo4j.services.LifecycleService.prototype.getStatus = neo4j.Service
        .resourceFactory({
            'resource' : 'status',
            'method' : 'GET'
        });

/**
 * Start the REST server.
 * 
 * @param callback
 *            will be called with lifecycle status information
 * @function
 */
neo4j.services.LifecycleService.prototype.start = neo4j.Service
        .resourceFactory({
            'resource' : 'start',
            'method' : 'POST'
        });

/**
 * Stop the REST server.
 * 
 * @param callback
 *            will be called with lifecycle status information
 * @function
 */
neo4j.services.LifecycleService.prototype.stop = neo4j.Service
        .resourceFactory({
            'resource' : 'stop',
            'method' : 'POST'
        });
/**
 * Restart the REST server.
 * 
 * @param callback
 *            will be called with lifecycle status information
 * @function
 */
neo4j.services.LifecycleService.prototype.restart = neo4j.Service
        .resourceFactory({
            'resource' : 'restart',
            'method' : 'POST'
        });
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The monitor service exposes a round-robin data sampler over the web. Through
 * this service, you can access various server metrics and their movement over
 * time.
 * 
 * @class Interface to the monitoring functionality of the REST server.
 * @extends neo4j.Service
 * @param db
 *            should be a neo4j.GraphDatabase object
 */
neo4j.services.MonitorService = function(db) {

	neo4j.Service.call(this,db);
    
};

_.extend(neo4j.services.MonitorService.prototype, neo4j.Service.prototype);

/**
 * Get monitoring data for a pre-defined (on the server side) time period up
 * until right now.
 * 
 * @param callback
 *            will be called with the monitor data
 * @function
 */
neo4j.services.MonitorService.prototype.getData = neo4j.Service
        .resourceFactory({
            'resource' : 'latest_data',
            'method' : 'GET'
        });

/**
 * Get monitoring data from a given timestamp up until right now.
 * 
 * @param from
 *            {Integer} a UTC timestamp in milliseconds.
 * @param callback
 *            will be called with the monitor data
 * @function
 */
neo4j.services.MonitorService.prototype.getDataFrom = neo4j.Service
        .resourceFactory({
            'resource' : 'data_from',
            'method' : 'GET',
            'urlArgs' : [ 'start' ]
        });

/**
 * Get monitoring data between two timestamps.
 * 
 * @param from
 *            {Integer} a UTC timestamp in milliseconds.
 * @param to
 *            {Integer} a UTC timestamp in milliseconds.
 * @param callback
 *            will be called with the monitor data
 * @function
 */
neo4j.services.MonitorService.prototype.getDataBetween = neo4j.Service
        .resourceFactory({
            'resource' : 'data_period',
            'method' : 'GET',
            'urlArgs' : [ 'start', 'stop' ]
        });
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @namespace Index utilities.
 */
neo4j.index = neo4j.index || {};
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Abstract parent class for NodeIndex and RelationshipIndex.
 * 
 * @class
 * @param db Should be a GraphDatabase instance.
 * @param name Should be the index name
 */
neo4j.index.Index = function(db, name)
{

    /**
     * A GraphDatabase instance.
     */
    this.db = db;
    
    /**
     * The name of this index.
     */
    this.name = name;
    
    /**
     * Configuration for this index, may be null
     * if config has not been fetched.
     */
    this.config = null;
    
    /**
     * Provider name
     */
    this.provider = "N/A";
    
    _.bindAll(this, 'query', 'exactQuery',
                    'index', 'unindex');

};

_.extend(neo4j.index.Index.prototype,
        
    /** @lends neo4j.index.Index# */          
    {

    getUriFor : function(item) { return ""; }, // To be implemented by subclasses
    getObjectFor : function(itemOrUri) { return ""; }, // To be implemented by subclasses
    getType : function() { return ""; },       // To be implemented by subclasses
    createObjectFromDefinition : function(def) {},
    
    getIdFor : function(itemPromise) { 
        return itemPromise.then(function(item, fulfill) {
            fulfill(item.getId());
        }); 
    },
    
    /**
     * Internal method, does not update
     * the actual configuration used in the DB.
     */
    setConfig : function(config) {
        this.config = config;
    },
    
    /**
     * Check if configuration info has been downloaded
     * for this index. Config info is automatically made
     * available if you get indexes via the getAllXIndexes methods.
     */
    configAvailable : function() {
        return this.config !== null;
    },
    
    getConfig : function() {
        return this.config;
    },
    
    /**
     * Perform an index query. How to write the query depends on what index
     * provider you are using, which you (on purpose or indirectly) decided when you created your index. 
     * The default one is Lucene, in which case you should use Lucene 
     * query syntax here.
     * 
     * For Lucene query syntax, see: http://lucene.apache.org/java/3_1_0/queryparsersyntax.html
     * 
     * @param query A query string
     * @return A list of nodes or relationships, depending on index type.
     */
    query : function(query) {
        var index = this;
        return this.db.getServiceDefinition().then(function(urls, fulfill, fail) {
            index.db.web.get(urls[index.getType()] + "/" + index.name, {query:query}, function(result) {
                var out = [];
                for(var i=0,l=result.length; i<l; i++) {
                    out.push(index.createObjectFromDefinition(result[i]));
                }
                fulfill(out);
            }, fail);
        });
    },

    /**
     * Look for exact matches on the given key/value pair.
     */
    exactQuery : function(key, value) {
        var index = this;
        return this.db.getServiceDefinition().then(function(urls, fulfill, fail) {
            index.db.web.get(urls[index.getType()] + "/" + index.name + "/" + key + "/" + value, function(result) {
                var out = [];
                for(var i=0,l=result.length; i<l; i++) {
                    out.push(index.createObjectFromDefinition(result[i]));
                }
                fulfill(out);
            }, fail);
        });
    },
    
    /**
     * Index a node or a relationship, depending on index type.
     * 
     * @param item An id, url or an instance of node or relationship, depending on the index type.
     * @param key The key to index the value with. (used when searching later on)
     * @param value (optional) The value to be indexed, defaults to the items value of the key property.
     */
    index : function(item, key, value) {
        var itemPromise = neo4j.Promise.wrap(item),
            keyPromise = neo4j.Promise.wrap(key),
            urlPromise = this.getUriFor(itemPromise),
            urlsPromise = this.db.getServiceDefinition(),
            index = this;
        
        if(typeof(value) === "undefined") {
            var valuePromise = this.getObjectFor(itemPromise).then(function(obj, fulfill){
                fulfill(obj.getProperty(key));
            });
        } else {
            var valuePromise = neo4j.Promise.wrap(value);
        }
        
        var allPromises = neo4j.Promise.join.apply(this, [urlPromise, keyPromise, valuePromise, urlsPromise]);
        return allPromises.then(function(values, fulfill, fail) {
            var url = values[0],
                key = values[1],
                value = values[2],
                urls = values[3];
            
            index.db.web.post(urls[index.getType()] + "/" + index.name + "/" + key + "/" + value, url, function(result) {
                fulfill(true);
            }, fail);
        });
    },
    
    /**
     * Remove an indexed item. 
     * 
     * @param item An id, url or an instance of node or relationship, depending on the index type.
     * @param key (Optional) Only remove the item from index entries with this key.
     * @param value (Optional) Allowed if key is provided, only remove the item from index entries with the given key and this value. 
     */
    unindex : function(item, key, value) {
        var itemPromise = neo4j.Promise.wrap(item),
            idPromise = this.getIdFor(itemPromise),
            urlsPromise = this.db.getServiceDefinition(),
            index = this;
        
        var allPromises = neo4j.Promise.join.apply(this, [idPromise, urlsPromise]);
        return allPromises.then(function(values, fulfill, fail) {
            var id = values[0],
                urls = values[1];
            
            var url = urls[index.getType()] + "/" + index.name;
            if(key) {
                url += "/" + key;
            }
            if(value) {
                url+= "/" + value;
            }
            url += "/" + id;
            
            index.db.web.del(url, function(result) {
                fulfill(true);
            }, fail);
        });
    }

});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * A node index.
 * 
 * @class
 * @extends neo4j.index.Index
 * @param db Should be a GraphDatabase instance.
 * @param name Should be the index name
 */
neo4j.index.NodeIndex = function(db, name)
{

    neo4j.index.Index.call(this, db, name);

};

_.extend(neo4j.index.NodeIndex.prototype, neo4j.index.Index.prototype,
    /** @lends neo4j.index.NodeIndex# */        
    {

    /**
     * @private
     */
    getType : function() {
        return "node_index";
    },
    
    /**
     * @private
     */
    getUriFor : function(itemPromise) {
        var db = this.db;
        return itemPromise.then(function(item, fulfill) {
            db.nodeUri(item).then(fulfill);  
        });
    },
    
    /**
     * @private
     */
    getObjectFor : function(unknownPromise) {
        var db = this.db;
        return unknownPromise.then(function(unknown, fulfill) {
            if(typeof(unknown.getSelf) != "undefined") {
                fulfill(unknown);
            } else {
                db.node(unknown).then(function(node) {
                   fulfill(node); 
                });
            }  
        });
    },
    
    /**
     * @private
     */
    createObjectFromDefinition : function(def) {
        return new neo4j.models.Node(def, this.db);
    }

});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * A relationship index.
 * 
 * @class
 * @extends neo4j.index.Index
 * @param db Should be a GraphDatabase instance.
 * @param name Should be the index name
 */
neo4j.index.RelationshipIndex = function(db, name)
{

    neo4j.index.Index.call(this, db, name);

};

_.extend(neo4j.index.RelationshipIndex.prototype, neo4j.index.Index.prototype, 
    /** @lends neo4j.index.RelationshipIndex# */ 
    {
    /**
     * @private
     */
    getType : function() {
        return "relationship_index";
    },
    
    /**
     * @private
     */
    getUriFor : function(itemPromise) {
        var db = this.db;
        return itemPromise.then(function(item, fulfill) {
            db.relUri(item).then(fulfill);  
        });
    },
    
    /**
     * @private
     */
    getObjectFor : function(unknownPromise) {
        var db = this.db;
        return unknownPromise.then(function(unknown, fulfill) {
            if(typeof(unknown.getSelf) != "undefined") {
                fulfill(unknown);
            } else {
                db.rel(unknown).then(function(rel) {
                   fulfill(rel); 
                });
            }  
        });
    },
    
    /**
     * @private
     */
    createObjectFromDefinition : function(def) {
        return new neo4j.models.Relationship(def, this.db);
    }


});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Handles node and relationship indexes.
 * 
 * @class
 * @param db Should be a GraphDatabase instance.
 */
neo4j.index.Indexes = function(db)
{

    /**
     * A GraphDatabase instance.
     */
    this.db = db;
    
    this._cache = {};
    
    _.bindAll(this, 'getNodeIndex',    'getRelationshipIndex',
                    'createNodeIndex', 'createRelationshipIndex',
                    'removeNodeIndex', 'removeRelationshipIndex');

};

_.extend(neo4j.index.Indexes.prototype,
    /** @lends neo4j.index.Indexes# */
    {
    
    /**
     * List all node indexes in the database.
     * 
     * Ex:
     * 
     * db.indexes.getAllNodeIndexes().then(function(indexes) {
     *     // Use indexes.
     * });
     * 
     * @return A promise object, promising a list of {@link neo4j.index.NodeIndex} instances.
     */
    getAllNodeIndexes : function() {
        return this._listAllIndexes("node_index");
    },

    
    /**
     * List all relationship indexes in the database.
     * 
     * Ex:
     * 
     * db.indexes.getAllNodeIndexes().then(function(indexes) {
     *     // Use indexes.
     * });
     * 
     * @return A promise object, promising a list of {@link neo4j.index.RelationshipIndex} instances.
     */
    getAllRelationshipIndexes : function() {
        return this._listAllIndexes("relationship_index");
    },
    
    /**
     * Retrieve a single index by name. The index does not have
     * to exist, it will be created the first time you insert something
     * into it. You can, however, not query a non-existant index.
     * 
     * @param name Should be the name of the index.
     * @return {@link neo4j.index.NodeIndex}
     */
    getNodeIndex : function(name) {
        return this._getOrCreateLocalIndexObject("node_index", name);
    },

    
    /**
     * Retrieve a single index by name. The index does not have
     * to exist, it will be created the first time you insert something
     * into it. You can, however, not query a non-existant index.
     * 
     * @param name Should be the name of the index.
     * @return {@link neo4j.index.RelationshipIndex}
     */
    getRelationshipIndex : function(name) {
        return this._getOrCreateLocalIndexObject("relationship_index", name);
    },
    
    /**
     * Create a new index.
     * 
     * @param name A unique index name.
     * @param config Optional configuration map, see neo4j server REST documentation.
     * @return A promise object, promising a {@link neo4j.index.NodeIndex}
     */
    createNodeIndex : function(name, config) {
        return this._createIndex("node_index", name, config);  
    },

    
    /**
     * Create a new index.
     * 
     * @param name A unique index name.
     * @param config Optional configuration map, see neo4j server REST documentation.
     * @return A promise object, promising a {@link neo4j.index.RelationshipIndex}
     */
    createRelationshipIndex : function(name, config) {
        return this._createIndex("relationship_index", name, config);
    },
    
    /**
     * Removes an index.
     * 
     * @param name Name of index to remove.
     * @return A promise for the delete operation to complete.
     */
    removeNodeIndex : function(name) {
        return this._removeIndex("node_index", name);
    },

    
    /**
     * Removes an index.
     * 
     * @param name Name of index to remove.
     * @return A promise for the delete operation to complete.
     */
    removeRelationshipIndex : function(name) {
        return this._removeIndex("relationship_index", name);
    },
    
    _listAllIndexes : function(type) {
        var db = this.db,
            indexes = this;
        return this.db.getServiceDefinition().then(function(urls, fulfill, fail){
            db.web.get(urls[type], function(indexMap) {
                var indexList = [],
                    indexNames = indexMap === null ? [] : _(indexMap).keys();

                for(var i=0,l=indexNames.length;i<l;i++) {
                    indexList.push(indexes._getOrCreateLocalIndexObject(type, indexNames[i], indexMap[indexNames[i]]));
                }
                fulfill(indexList);
            }, fail);
        });
    },
    
    _createIndex : function(type, name, config) {
        var config = config || {provider:"lucene", type : "exact"},
            db = this.db,
            indexes = this;
        return this.db.getServiceDefinition().then(function(urls, fulfill, fail){
            db.web.post(urls[type], { name : name, config : config }, function(data) {
                fulfill(indexes._getOrCreateLocalIndexObject(type, name, config));
            }, fail);
        });
    },
    
    _removeIndex : function(type, name) {
        var db = this.db;
        return this.db.getServiceDefinition().then(function(urls, fulfill, fail){
            db.web.del(urls[type] + "/" + name, fulfill, fail);
        });
    },
    
    _getOrCreateLocalIndexObject : function(type, name, config) {
        
        var config = config || null;
        
        if(typeof(this._cache[type]) == "undefined") {
            this._cache[type] = {};
        }
        
        if(typeof(this._cache[type][name]) == "undefined") {
            if(type === "relationship_index") {
                var instance = new neo4j.index.RelationshipIndex(this.db, name);
            } else {
                var instance = new neo4j.index.NodeIndex(this.db, name);
            }
            this._cache[type][name] = instance; 
        }
        
        if(config != null) {
            if(config['provider']) {
                this._cache[type][name].provider = config['provider'];
                delete(config['provider']);
            }
            if(config['template']) {
                delete(config['template']);
            }
            this._cache[type][name].setConfig(config);
        }
        
        return this._cache[type][name];
    }

});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Manage a neo4j REST server with management enabled.
 * 
 * @class
 * @param url
 *            the url to the REST management server
 * @returns a new GraphDatabaseManager instance
 */
neo4j.GraphDatabaseManager = function(db) {
	
	_.bindAll(this, 'discoverServices');
	
    this.db = db;

    /**
     * Backup service, instance of {@link neo4j.services.BackupService}
     */
    this.backup = new neo4j.services.BackupService(db);

    /**
     * Configuration service, instance of {@link neo4j.services.ConfigService}
     */
    this.config = new neo4j.services.ConfigService(db);

    /**
     * Import service, instance of {@link neo4j.services.ImportService}
     */
    this.importing = new neo4j.services.ImportService(db);

    /**
     * Export service, instance of {@link neo4j.services.ExportService}
     */
    this.exporting = new neo4j.services.ExportService(db);

    /**
     * Console service, instance of {@link neo4j.services.ConsoleService}
     */
    this.console = new neo4j.services.ConsoleService(db);

    /**
     * JMX service, instance of {@link neo4j.services.JmxService}
     */
    this.jmx = new neo4j.services.JmxService(db);

    /**
     * Lifecycle service, instance of {@link neo4j.services.LifecycleService}
     */
    this.lifecycle = new neo4j.services.LifecycleService(db);

    /**
     * Monitor service, instance of {@link neo4j.services.MonitorService}
     */
    this.monitor = new neo4j.services.MonitorService(db);
    
    this.db.getServiceDefinition().then(this.discoverServices);
};

_.extend(neo4j.GraphDatabaseManager.prototype,{
	
	/**
	 * Check if services have been loaded. You can also listen for the
	 * services.loaded event.
	 * 
	 * @returns {Boolean} true if services are loaded.
	 */
	servicesLoaded : function() {
	    return (this.services) ? true : false;
	},
	
	/**
	 * Get a list of available services.
	 * 
	 * @throws Error
	 *             if services have not been loaded yet (use {@link #servicesLoaded}
	 *             or the services.loaded event to check).
	 */
	availableServices : function() {
	    if (this.services)
	    {
	
	        if (!this.serviceNames)
	        {
	            this.serviceNames = [];
	            for ( var name in this.services)
	            {
	                this.serviceNames.push(name);
	            }
	        }
	
	        return this.serviceNames;
	    } else
	    {
	        throw new Error("Service definition has not been loaded yet.")
	    }
	},
	
	/**
	 * Connect to the server and find out what services are available.
	 */
	discoverServices : function() {
	
        var manage = this;
        this.db.getDiscoveryDocument().then(function(discovery) {
	        manage.db.web.get(discovery.management,
    	    // Success
    	    neo4j.proxy(function(serviceDefinition) {
    	        this.services = serviceDefinition.services;
    	
    	        for ( var service in serviceDefinition.services)
    	        {
    	            if (this[service])
    	            {
    	                this[service]
    	                        .makeAvailable(serviceDefinition.services[service]);
    	            }
    	        }
    	
    	        this.db.trigger("services.loaded");
    	
    	    }, manage),
    	    // Failure
    	    neo4j.proxy(function(fail) {
    	        neo4j.log("Unable to fetch service descriptions for server "
    	                + this.url + ". Server management will be unavailable.");
    	    }, this));
        });
	
	}
});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Connect to a neo4j REST server.
 * 
 * <br />
 * Example:
 * 
 * <pre>
 * var db = new neo4j.GraphDatabase(&quot;http://localhost:9999/&quot;);
 * </pre>
 * 
 * @class
 * @param url the url to the neo4j server
 * @returns a new GraphDatabase instance
 */
neo4j.GraphDatabase = function(url, webClient)
{

    /**
     * The url to the REST server's discovery document
     */
    this.url = url;

    /**
     * Event handler, instance of {@link neo4j.Events}.
     */
    this.events = new neo4j.Events({
        db : this });

    /**
     * Convinience access to event bind method.
     * 
     * @see neo4j.Events#bind
     */
    this.bind = neo4j.proxy(this.events.bind, this.events);

    /**
     * Client used to perform http actions. Can be any object that implements
     * the same API as {@link neo4j.Web}.
     */
    this.web = webClient || new neo4j.Web(null, this.events);

    /**
     * Convinience access to event trigger method.
     * 
     * @see neo4j.Events#trigger
     */
    this.trigger = neo4j.proxy(this.events.trigger, this.events);

    /**
     * Indexes, instance of {@link neo4j.index.Indexes}.
     */
    this.index = new neo4j.index.Indexes(this);

    /**
     * Cypher ExecutionEngine, instance of {@link neo4j.cypher.ExecutionEngine}.
     */
    this.cypher = new neo4j.cypher.ExecutionEngine(this);
    
    /**
     * Manager, instance of {@link neo4j.GraphDatabaseManager}.
     */
    this.manage = new neo4j.GraphDatabaseManager(this);

    /**
     * Heartbeat, instance of {@link neo4j.GraphDatabaseHeartbeat}.
     */
    this.heartbeat = new neo4j.GraphDatabaseHeartbeat(this);

    // Rapid access
    this.rel = this.relationship;
    this.referenceNode = this.getReferenceNode;
    
    _.bindAll(this, 'getServiceDefinition', 'getReferenceNode', 'node', 
              'relationship', 'getReferenceNodeUrl', 'getAvailableRelationshipTypes', 'get', 'put', 'post', 'del', 'forceRediscovery');

};

_.extend(neo4j.GraphDatabase.prototype, 
    /** @lends neo4j.GraphDatabase# */    
    {

    /**
     * Used to manipulate nodes.
     * 
     * @param arg
     *            Is either a node url or a map of attributes to create a new
     *            node. It can also be a promise of either one.
     */
    node : function(arg)
    {
        var db = this,
            promisedArg = neo4j.Promise.wrap(arg);
        return promisedArg.then(
            function(arg, fulfill, fail) {
                if (typeof (arg) === "object")
                {
                    // Create a new node
                    var node = new neo4j.models.Node({data : arg }, db);
                    node.save().then(function(savedNode) {
                        fulfill(savedNode);
                    }, fail);
                } else
                {
                    // Fetch a node
                    var urlPromise = db.promiseNodeOrNodeUrl(arg);
                    urlPromise.then(function(url) {
                        var node = new neo4j.models.Node({ self : url }, db);
                        node.fetch().then(function(fetchedNode) {
                            fulfill(fetchedNode);
                        }, function(){
                            fail(new neo4j.exceptions.NotFoundException(url));
                        });
                    });
                }
            });
    },

    /**
     * Used to get a relationship by url, or to create a new relationship.
     * 
     * @param arg1
     *            Should be a relationship url (self), or a start node if you 
     *            are creating a new relationship, or a promise for either one.
     * @param type 
     *            The type of relationship to create, if you are creating a 
     *            relationship. A promise for a type is also ok.
     * @param toNode
     *            End node if you are creating a relationship, or promise for one.
     * @param data 
     *            Map of properties if you are creating a relationship, or
     *            a promise of one. Optional if you don't want to specify 
     *            any properties.
     */
    relationship : function(fromNode, type, toNode, data)
    {
        var db = this;
        if( typeof(type) == "undefined" ) {
            // Fetch relationship
            var urlPromise = this.promiseRelationshipOrRelationshipUrl(fromNode);
            
            return urlPromise.then(function(url, fulfill, fail){
                var relationship = new neo4j.models.Relationship({self:url}, db);
                relationship.fetch().then(function(fetchedRelationship) {
                   fulfill(fetchedRelationship); 
                }, function() {
                    fail(new neo4j.exceptions.NotFoundException(url));
                });
            });
        } else {
            // Create relationship
            var dataPromise = neo4j.Promise.wrap(data || {}),
                typePromise = neo4j.Promise.wrap(type),
                fromNodePromise = this.promiseNodeOrNodeUrl(fromNode),
                toNodePromise = this.promiseNodeOrNodeUrl(toNode);
            
            var all = neo4j.Promise.join(fromNodePromise, toNodePromise, typePromise, dataPromise);
            return all.then(function(results, fulfill, fail)  {
                var relationship = new neo4j.models.Relationship({
                    start : results[0],
                    end : results[1],
                    type : results[2],
                    data : results[3]
                }, db);
                relationship.save().then(function(savedRelationship) {
                   fulfill(savedRelationship); 
                }, fail);
            });
        }
    },
    
    /**
     * Execute a cypher query against this database.
     * @param query A cypher query string.
     * @return A promise for a neo4j.cypher.QueryResult
     */
    query : function(query) {
        return this.cypher.execute(query);
    },

    /**
     * Given a url for either a node or a relationship,
     * load the appropriate object.
     * @param url A url for either a node or a relationship
     * @return A promise for a node or a relationship.
     */
    getNodeOrRelationship : function(url) {
        var db = this;
        return this.isNodeUrl(url).then(function(isNodeUrl, fulfill, fail) {
            if(isNodeUrl) {
                db.node(url).then(function(node) {
                    fulfill(node);
                }, fail);
            } else {
                db.rel(url).then(function(rel) {
                    fulfill(rel);
                }, fail);
            }
        });
    },
    
    /**
     * @return A promise for the reference node.
     */
    getReferenceNode : function()
    {
        return this.node(this.getReferenceNodeUrl());
    },
    
    /**
     * @return A promise for an array of strings, each string a relationship
     * type in use in the database. 
     */
    getAvailableRelationshipTypes : function() {
        var db = this;
        return this.getServiceDefinition().then(function(service, fulfill, fail){
            db.web.get(service.relationship_types, function(types) {
                fulfill(types);
            }, fail);
        });
    },

    /**
     * @return A promise for the reference node url.
     */
    getReferenceNodeUrl : function()
    {
        return this.getServiceDefinition().then(function(serviceDefinition, fulfill, fail) {
            if( typeof(serviceDefinition.reference_node) !== "undefined") {
                fulfill(serviceDefinition.reference_node);
            } else {
                fail();
            }
        });
    },
    
    nodeUri : function(id) {
        if(typeof(id.getSelf) != "undefined") {
            return neo4j.Promise.wrap(id.getSelf());
        }
        
        return this.getServiceDefinition().then(function(def, fulfill) {
            if(/^[0-9]+$/i.test(id)) {
                fulfill(def.node+"/"+id);
            } else {
                fulfill(id);
            }
        });
    },

    relUri : function(id) {
        if(typeof(id.getSelf) != "undefined") {
            return neo4j.Promise.wrap(id.getSelf());
        }
        
        return this.getDiscoveryDocument().then(function(urls, fulfill){
            if(/^[0-9]+$/i.test(id)) {
                // There is currently no way to discover relationship url
                fulfill(urls['data'] + "relationship/" + id);
            } else {
                fulfill(id);
            }
        });
    },
    
    /**
     * @return A promise for a map of services, as they are returned
     *         from a GET call to the server data root.
     */
    getServiceDefinition : function()
    {
        if (typeof (this._serviceDefinitionPromise) === "undefined")
        {
            var db = this;
            this._serviceDefinitionPromise = this.getDiscoveryDocument().then(function( discovery, fulfill, fail ) {
                db.web.get( discovery.data , function(resources)
                {
                    fulfill(resources);
                });
            });
        }

        return this._serviceDefinitionPromise;
    },
    
    getDiscoveryDocument : function() {
        if (typeof (this._discoveryDocumentPromise) === "undefined")
        {
            var db = this;
            this._discoveryDocumentPromise = new neo4j.Promise(function(
                    fulfill, fail)
            {
                db.web.get(db.url, function(resources)
                {
                    fulfill(resources);
                });
            });
        }

        return this._discoveryDocumentPromise
    },

    /**
     * Perform a http GET call for a given resource.
     * @deprecated Use #web instead.
     * @param resource
     *            is the resource to fetch (e.g. /myresource)
     * @param data
     *            (optional) object with data
     * @param success
     *            (optional) success callback
     * @param failure
     *            (optional) failure callback
     */
    get : function(resource, data, success, failure)
    {
        this.web.get(this.url + resource, data, success, failure);
    },

    /**
     * Perform a http DELETE call for a given resource.
     * @deprecated Use #web instead.
     * 
     * @param resource
     *            is the resource to fetch (e.g. /myresource)
     * @param data
     *            (optional) object with data
     * @param success
     *            (optional) success callback
     * @param failure
     *            (optional) failure callback
     */
    del : function(resource, data, success, failure)
    {
        this.web.del(this.url + resource, data, success, failure);
    },

    /**
     * Perform a http POST call for a given resource.
     * @deprecated Use #web instead.
     * 
     * @param resource
     *            is the resource to fetch (e.g. /myresource)
     * @param data
     *            (optional) object with data
     * @param success
     *            (optional) success callback
     * @param failure
     *            (optional) failure callback
     */
    post : function(resource, data, success, failure)
    {
        this.web.post(this.url + resource, data, success, failure);
    },

    /**
     * Perform a http PUT call for a given resource.
     * @deprecated Use #web instead.
     * 
     * @param resource
     *            is the resource to fetch (e.g. /myresource)
     * @param data
     *            (optional) object with data
     * @param success
     *            (optional) success callback
     * @param failure
     *            (optional) failure callback
     */
    put : function(resource, data, success, failure)
    {
        this.web.put(this.url + resource, data, success, failure);
    },

    /**
     * If the host in the url matches the REST base url, the rest base url will
     * be stripped off. If it matches the management base url, that will be
     * stripped off.
     * 
     * If none of them match, the host will be stripped off.
     * 
     * @param url
     *            {String}
     */
    stripUrlBase : function(url)
    {
        if (typeof (url) === "undefined" || url.indexOf("://") == -1)
        {
            return url;
        }

        if (url.indexOf(this.url) === 0)
        {
            return url.substring(this.url.length);
        } else if (url.indexOf(this.manageUrl) === 0)
        {
            return url.substring(this.manageUrl.length);
        } else
        {
            return url.substring(url.indexOf("/", 8));
        }
    },
    
    /**
     * Determine if a given url is a node url.
     * @return A promise for a boolean response.
     */
    isNodeUrl : function(url) {
        return this.getServiceDefinition().then(function(urls, fulfill){
            fulfill(url.indexOf(urls['node']) === 0);
        });
    },
    
    promiseNodeOrNodeUrl : function(unknown) {
        if(typeof(unknown) === "object" || this.isUrl(unknown)) {
            return neo4j.Promise.wrap(unknown);
        } else {
            return this.nodeUri(unknown);
        }
    },
    
    promiseRelationshipOrRelationshipUrl : function(unknown) {
        if(typeof(unknown) === "object" || this.isUrl(unknown)) {
            return neo4j.Promise.wrap(unknown);
        } else {
            return this.relUri(unknown); 
        }
    },
    
    /**
     * Naive check to see if input contains ://
     */
    isUrl : function(variableToCheck) {
        if(typeof(variableToCheck) === "object") return false;
        
        variableToCheck += "";
        return variableToCheck.indexOf("://") !== -1;
    },

    /**
     * Serialize this {@link GraphDatabase} instance.
     */
    toJSONString : function()
    {
        return { url : this.url };
    },
    
    /**
     * A call to this method will force a rediscovery of the 
     * server the next time something requests info about the
     * server discovery document.
     */
    forceRediscovery : function() {
        delete this._discoveryDocumentPromise;
        delete this._serviceDefinitionPromise;
    }

});
/*
 * Copyright (c) 2002-2011 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
 services
 exceptions
 setTimeout
 clearTimeout
 _intervals
 setInterval
 clearInterval
 Promise
 cachedFunction
 log
 proxy
 Events
 events
 jqueryWebProvider
 Web
 Service
 GraphDatabaseHeartbeat
 models
 traverse
 cypher
 index
 GraphDatabaseManager
 GraphDatabase
 */


exports.GraphDatabase = function (url) {
    return new neo4j.GraphDatabase(url);
};
