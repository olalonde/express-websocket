var http = require('http');
var ws = require('ws');

module.exports = function (app, wss) {
  if (!wss) {
    wss = new ws.Server({ noServer: true });
  }

  // https://github.com/websockets/ws/blob/master/lib/WebSocketServer.js#L77
  return function (req, socket, upgradeHead) {
    var res = new http.ServerResponse(req);
    res.assignSocket(socket);

    // avoid hanging onto upgradeHead as this will keep the entire
    // slab buffer used by node alive
    var head = Buffer.alloc(upgradeHead.length);
    upgradeHead.copy(head);

    res.on('finish', function () {
      res.socket.destroy();
    });

    res.websocket = function (cb) {
      wss.handleUpgrade(req, socket, head, function (client) {
        //client.req = req; res.req
        wss.emit('connection'+req.url, client);
        wss.emit('connection', client);
        if (cb) cb(client);
      });
    };

    return app(req, res);
  };
};
