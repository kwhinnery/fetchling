(function() {
var sa = require('superagent');

// Default HTTP methods supported by a resource
var METHODS = ['get','post','put','delete','head','options','trace','connect'];

/*
Extend a target object with properties from the source object (shallow copy)

@param {object} target - object to be extended
@param {object} source - source to copy from 
@return {object} - target, plus properties from source
*/
function extend(target, source) {
    target = target || {};
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
        }
    }
    return target;
}

/*
Create a fetchling resource.

@param {string|object} resourceConfig - proerties or URL of the resource
@param {object} clientConfig - configuration for HTTP requests 
@return {object} - a fetchling resource
*/
function fetchling(resourceConfig, clientConfig) {
    // fetchling instance is a function that returns a resource
    var f = function(path) {
        var resource = fetchling(f, f.client);
        resource.url = resource.url + '/' + path;
        return resource;
    };

    // fetchling default configuration
    f.url = '/';
    f.methods = METHODS;

    // Allow user to override
    extend(f, resourceConfig);

    if (typeof resourceConfig === 'string') {
        f.url = resourceConfig;
    }

    // HTTP client configuration
    f.client = extend({
        type: 'application/x-www-form-urlencoded',
        accept: 'application/json'
    }, clientConfig || {});

    // Add an HTTP request function for each configured HTTP method
    f.methods.forEach(function(method) {
        var meth = method.toLowerCase();
        f[meth] = function(args, callback) {
            if (typeof args === 'function') {
                callback = args;
                args = {};
            }
            f.request(meth.toUpperCase(), args, callback);
        };
    });

    /*
    Set HTTP Basic auth credentials

    @param {string} username - HTTP Basic username
    @param {string} password - HTTP Basic password
    */
    f.auth = function(username, password) {
        f.client.auth = {
            username: username,
            password: password
        };
    };

    /*
    Send an HTTP request to the URL associated with this fetching resource

    @param {string} method - HTTP verb
    @param {object} args - query parameters or POST parameters
    @param {function} callback - status callback for after request
    */
    f.request = function(method, args, callback) {
        var saRequest = sa(method, f.url);
        saRequest.accept(f.client.accept);
        saRequest.type(f.client.type);

        // Apply basic auth, if provided
        if (f.client.auth) {
            saRequest.auth(client.auth.username, client.auth.password);
        }

        // Use query string params
        if (args && 
            (method === 'GET' || method === 'OPTIONS' || method === 'HEAD')) {
            
        }

        // Execute the ajax!
        saRequest.end(function(err, response) {
            callback(err, (response) ? response.body : null);
        });
    };

    // return fetchling resource
    return f;
}

// Add method config to module interface
fetchling.METHODS = METHODS;

// Support CommonJS or browser global
if (module.exports) module.exports = fetchling;
else window.fetchling = fetchling;
})();