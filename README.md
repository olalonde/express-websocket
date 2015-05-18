# express-websocket

Use Express middleware before initiating web socket connection.

## Install

```bash
npm install --save express-websocket
```

## Usage

```
var express = require('express');
var http = require('http');
var ws = require('ws');

var handleUpgrade = require('express-websocket');

var app = express();
var server = http.createServer(app);
var wss = new ws.Server({ noServer: true });

app.use('/websocket', function (req, res, next) {
  res.websocket(function (ws) {
    // Optional callback
    ws.send('hello');
  });
});

server.on('upgrade', handleUpgrade(app, wss));

server.listen(3000);
```
