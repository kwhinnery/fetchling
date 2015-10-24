var Resource = require('./Resource');

// Create API client
function Client(httpClientOptions, originalResourceConfig, fetchlingConfig) {
    fetchlingConfig = fetchlingConfig || {};
    httpClientOptions = httpClientOptions || {};

    // Create JavaScript properties for configured resources
    function assignResources(obj, baseUrl, resourceConfig) {
        // Create the main resource 
        var resource = new Resource({
            httpClientOptions: httpClientOptions,
            fetchlingConfig: fetchlingConfig,
            url: baseUrl + resourceConfig.url,
            methods: resourceConfig.methods
        });

        // TODO: Add sub-resources and instance sub-resources
        return resource;
    }

    // Create the top-level client resource
    var clientInstance = assignResources(
        clientInstance, 
        '', // No base URL since this is the first resource URL
        originalResourceConfig
    );

    // Allow ad-hoc creation of resources with a given URL, but use the global
    // HTTP client and Fetchling configuration for parameter massaging, etc
    clientInstance.resource = function createAdHocResource(url) {
        var adHocResource = new Resource({
            httpClientOptions: httpClientOptions,
            fetchlingConfig: fetchlingConfig,
            url: url
        });

        return adHocResource;
    };

    // The client we return is actually a Resource with a bit of extra sugar
    return clientInstance;
}

module.exports = Client;