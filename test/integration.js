var http = require('http');
var chai = require('chai');
var expect = chai.expect;
var express = require('express');
var bodyparser = require('body-parser');
var fetchling = require('../fetchling');

// Create Express app to test against
var app = express();
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
    response.send({
        foo: 'barrr!'
    });
});

var server = http.createServer(app);
var port = 4567;
var url = 'http://localhost:' + String(port);
server.listen(port);

describe('fetchling()#get', function() {
    it('should return JSON from the root URL', function(done) {
        var f = fetchling(url);
        f.get(function(err, data) {
            expect(err).to.not.exist;
            expect(data.foo).to.equal('barrr!');
            done();
        });
    });
});