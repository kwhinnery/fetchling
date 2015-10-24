var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var fetchling = require('../fetchling');

// Use sinon plugin for chai
chai.use(require('sinon-chai'));

var testPort = 4567;
var baseUrl = 'http://localhost:' + String(testPort);

describe('fetchling()', function() {
    it('should default the URL to /', function() {
        var f = fetchling();
        expect(f.url).to.equal('/');
    });

    it('should create a resource w/default HTTP methods and a URL', function() {
        var simple = fetchling(baseUrl);

        expect(simple.url).to.equal(baseUrl);
        fetchling.METHODS.forEach(function(method) {
            expect(simple[method]).to.exist;
        });
    });

    it('should create a resource w/ custom config', function() {
        var simple = fetchling({
            url: baseUrl,
            methods: ['GET', 'POST']
        });

        expect(simple.url).to.equal(baseUrl);
        expect(simple.get).to.exist;
        expect(simple.post).to.exist;
        expect(simple.put).to.not.exist;
    });

    it('should accept basic auth credentials in constructor', function() {
        var simple = fetchling({
            url: baseUrl,
            methods: ['GET', 'POST']
        }, {
            auth: {
                username: 'foo',
                password: 'bar'
            }
        });

        expect(simple.client.auth.username).to.equal('foo');
        expect(simple.client.auth.password).to.equal('bar');
    });

    it('set auth via an instance function', function() {
        var simple = fetchling({
            url: baseUrl,
            methods: ['GET', 'POST']
        });

        simple.auth('foo', 'bar');

        expect(simple.client.auth.username).to.equal('foo');
        expect(simple.client.auth.password).to.equal('bar');
    });
});

describe('fetchling()#method', function() {
    it('should get able to send a GET request to /', function(done) {
        var f = fetchling();
        expect(f.url).to.equal('/');

        sinon.spy(f, 'request');
        function cb(err, response) {
            done();
        }
        f.get(cb);

        expect(f.request).to.have.been.calledWith('GET', {}, cb);
    });

    it('should send a request with parameters and a callback', function(done) {
        var f = fetchling();

        sinon.spy(f, 'request');
        function cb(err, response) {
            done();
        }
        f.post({
            foo: 'bar'
        }, cb);

        expect(f.request).to.have.been.calledWith('POST', {
            foo: 'bar'
        }, cb);
    });

    it('should send a request with just a callback', function(done) {
        var f = fetchling();

        sinon.spy(f, 'request');
        function cb(err, response) {
            done();
        }
        f.post(cb);

        expect(f.request).to.have.been.calledWith('POST', {}, cb);
    });
});