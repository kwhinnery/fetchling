// Create a Fetchling resource
function fetchling() {
    var url, // Base URL for this resource
        methods, // HTTP methods
        resources, // Sub-resources of this resource
        instanceResources, // Sub-resources of an instance of this resource
        instanceMethods, // HTTP methods supported by an instance of this resource
        httpOptions; // options for HTTP requests made to this resource

    // Process fetchling arguments



    /*
    if (!resourceConfig) {
        throw new Error('Resource configuration is required as the '
            + 'first argument');
    }

    // Return API user-facing client constructor
    return function ClientConstructor() {
        var options = arguments[0];

        // Can directly assign basic auth credentials in constructor if the
        // first two arguments are strings
        if (typeof arguments[0] === 'string') {
            if (typeof arguments[1] !== 'string') {
                throw new Error('Constructor options must be your HTTP basic '
                    + 'username and password, plus an optional object literal '
                    + 'containing HTTP client options, or you must only '
                    + 'supply an object literal with HTTP client.');
            }
            options = arguments[2] || {};
            options = {
                auth: {
                    username: arguments[0],
                    password: arguments[1]
                }
            };
        }

        // Return a new API client with the given configuration
        return new Client(options, resourceConfig, fetchlingConfig);
    };
    */
}

module.exports = fetchling;