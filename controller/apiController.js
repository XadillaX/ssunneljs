/**
 * Created by XadillaX on 2014/6/14.
 */
var tunnel = require("../model/tunnelModel");

/**
 * delete
 * @param req
 * @param resp
 */
exports.delete = function(req, resp) {
    var id = req.body.tunnelId;
    tunnel.delete(id, function(err) {
        if(err) {
            resp.send(200, {
                status  : false,
                msg     : err.message,
                list    : tunnel.getList(true)
            });
            return;
        }

        resp.send(200, {
            status      : true,
            list        : tunnel.getList(true)
        })
    });
};

/**
 * disconnect
 * @param req
 * @param resp
 */
exports.disconnect = function(req, resp) {
    var id = req.body.tunnelId;
    tunnel.disconnect(id, function(err) {
        if(err) {
            resp.send(200, {
                status  : false,
                msg     : err.message,
                list    : tunnel.getList(true)
            });
            return;
        }

        resp.send(200, {
            status      : true,
            list        : tunnel.getList(true)
        })
    });
};

/**
 * connect
 * @param req
 * @param resp
 */
exports.connect = function(req, resp) {
    var id = req.body.tunnelId;
    tunnel.connect(id, function(err) {
        if(err) {
            resp.send(200, {
                status  : false,
                msg     : err.message,
                list    : tunnel.getList(true)
            });
            return;
        }

        resp.send(200, {
            status      : true,
            list        : tunnel.getList(true)
        })
    });
};

/**
 * tunnel list
 * @param req
 * @param resp
 */
exports.list = function(req, resp) {
    var list = tunnel.getList(true);

    resp.send(200, {
        status  : true,
        list    : list
    });
};

/**
 * 添加SSH反向隧道
 * @param req
 * @param resp
 */
exports.addTunnel = function(req, resp) {
    var host = req.body.host;
    var remotePort = req.body.remotePort;
    var localPort = req.body.localPort;
    var username = req.body.username;
    var pkfilename = req.body.pkfilename;

    remotePort = parseInt(remotePort);
    localPort = parseInt(localPort);

    if(isNaN(remotePort) || remotePort < 1 || remotePort > 65535) {
        resp.send(200, {
            status      : false,
            msg         : "Please fill a correct remote port."
        });
        return;
    }

    if(isNaN(localPort) || localPort < 1 || localPort > 65535) {
        resp.send(200, {
            status      : false,
            msg         : "Please fill a correct local port."
        });
        return;
    }

    var json = tunnel.addTunnel(host, remotePort, localPort, username, pkfilename);

    resp.send(200, {
        status      : true,
        list        : json
    });
};
