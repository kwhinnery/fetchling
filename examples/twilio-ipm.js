var fetchling = require('../lib/fetchling');

// Declare Twilio IP Messaging REST API format
var ipmConfig = {
    url: 'https://ip-messaging.twilio.com/v1',
    resources: {
        services: {
            url: '/Services',
            methods: ['get', 'post'],
            instanceMethods: ['get', 'post', 'delete'],
            instanceResources: {
                channels: {
                    url: '/Channels',
                    methods: ['get', 'post'],
                    instanceMethods: ['get', 'post', 'delete'],
                    instanceResources: {
                        members: {
                            url: '/Members',
                            methods: ['get', 'post'],
                            instanceMethods: ['get', 'post', 'delete']
                        },
                        messages: {
                            url: '/Messages',
                            methods: ['get', 'post'],
                            instanceMethods: ['get']
                        }
                    }
                },
                roles: {
                    url: '/Roles',
                    methods: ['get', 'post'],
                    instanceMethods: ['get', 'post', 'delete']
                },
                users: {
                    url: '/Users',
                    methods: ['get', 'post'],
                    instanceMethods: ['get', 'post', 'delete']
                }
            }
        },
        credentials: {
            url: '/Credentials',
            methods: ['get', 'post'],
            instanceMethods: ['get', 'post', 'delete']
        }
    }
};

// Create a REST API client based on resource structure
var IpmClient = fetchling(ipmConfig);

// Create an instance of an authenticated client
var ipm = new IpmClient('sid', 'tkn');

// Use the client
var chatRoom = ipm.services('ISxxx').channels('CHxxx').messages;
chatRoom.post({
    Body: 'testing testing 123...'
}, function(err, data) {
    console.log(data);
});

// Use relative URLs without JS aliases
ipm('Services/ISxxx/Channels/CHzzz/Messages').post(function(err, data) {
    console.log(data);
});

// Use the client to request an arbitrary URL with configured auth headers,
// and any other config options - useful for utilizing hypermedia URLs in
// response data
ipm.resource(ipm.baseUrl + '/Services/ISxxx').get(function(err, data) {
    console.log(data);
});
