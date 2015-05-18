var expect = require('chai').expect;
var wsocket = require('ws');

function mockServer (cb) {
  var express = require('express');
  var http = require('http');

  var handleUpgrade = require('../');

  var app = express();
  var server = http.createServer(app);
  var wss = new wsocket.Server({ noServer: true });

  app.use('/websocket', function (req, res, next) {
    res.websocket(function (ws) {
      // Optional callback
      ws.send('hello');
    });
  });

  server.on('upgrade', handleUpgrade(app, wss));

  server.listen(3000, cb);
}


describe('express-websocket', function () {
  var ws;

  before(function (done) {
    mockServer(done);
  });

  before(function () {
    ws = new wsocket('ws://localhost:3000/websocket');
  });

  it('should open connection', function (done) {
    ws.on('open', done);
  });
  it('should receive hello', function (done) {
    ws.on('message', function (msg) {
      expect(msg).to.equal('hello');
      done();
    });
  });
});

