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

  app.use('/error', function (req, res, next) {
    res.status(401);
    res.json({ error: 'Unauthorized' });
  });

  server.on('upgrade', handleUpgrade(app, wss));

  server.listen(3000, cb);
  return server;
}


describe('express-websocket', function () {
  var ws, server, client;

  before(function (done) {
    server = mockServer(done);
  });

  it('should not open connection on /error', function (done) {
    client = new wsocket('ws://localhost:3000/error');
    client.on('error', function () {
      done();
    });
  });

  it('should open connection', function (done) {
    ws = new wsocket('ws://localhost:3000/websocket');
    ws.on('message', saveMessage);
    ws.on('open', done);
  });

  var message;
  function saveMessage(receivedMessage) {
    message = receivedMessage;
  }

  it('should receive hello', function () {
    expect(message).to.equal('hello');
  });
  
  it('should close connection', function (done) {
    ws.on('close', function (code, message) {
      done();
    });
    ws.close();
  });
  
  it('should close server', function (done) {
    server.close(done);
  });
});

