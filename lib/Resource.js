var request = require('request');

// A REST resource
function Resource(options) {
    var httpOptions = options.httpOptions || {};
    var fetchlingConfig = options.fetchlingConfig || {};
    var url = options.url;
    var methods = options.methods || Resource.defaultMethods;

    if (!url || url === '') {
        throw new Error('Resource URL is required.');
    }

    
}

// Default HTTP method set
Resource.defaultMethods = ['get', 'post', 'put', 'delete', 'head', 'options', 
    'trace', 'connect'];

module.exports = Resource;