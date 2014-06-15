/**
 * Created by XadillaX on 2014/6/14.
 */
var fs = require("fs");
var childProcess = require('child_process');
var moment = require("moment");
require("sugar")
var tunnels = [  ];

/**
 * delete a tunnel.
 * @param tunnelId
 * @param callback
 */
exports.delete = function(tunnelId, callback) {
    for(var i = 0; i < tunnels.length; i++) {
        if(tunnels[i].config.tunnelId.toString() === tunnelId.toString()) {
            var tunnel = tunnels[i];
            if(tunnel.connected) {
                tunnel.child.kill("SIGINT");
                tunnel.child = undefined;
                tunnel.connected = false;
            }

            tunnels.removeAt(i);
            tunnel = undefined;

            callback();

            var json = this.getList();
            fs.writeFile("tunnels.json", JSON.stringify(json));
            return;
        }
    }

    callback(new Error("No such tunnel."));
};

/**
 * disconnect
 * @param tunnelId
 * @param callback
 */
exports.disconnect = function(tunnelId, callback) {
    for(var i = 0; i < tunnels.length; i++) {
        if(tunnels[i].config.tunnelId.toString() === tunnelId.toString()) {
            var tunnel = tunnels[i];
            if(!tunnel.connected) {
                callback(new Error("This tunnel is already disconnected."));
                return;
            }

            tunnel.child.kill("SIGINT");
            tunnel.child = undefined;
            tunnel.connected = false;

            callback();

            return;
        }
    }

    callback(new Error("No such tunnel."));
};

/**
 * connect to a tunnel...
 * @param tunnelId
 * @param callback
 */
exports.connect = function(tunnelId, callback) {
    var self = this;
    for(var i = 0; i < tunnels.length; i++) {
        if(tunnels[i].config.tunnelId.toString() === tunnelId.toString()) {
            (function(i) {
                var tunnel = tunnels[i];

                if(tunnel.connected) {
                    callback(new Error("This tunnel is already connected."));
                    return;
                }

                tunnel.connected = true;
                //console.log(tunnel);
                var child = childProcess.spawn("plink",
                    [ "-pw", tunnel.config.password, "-C", "-N", "-R",
                            tunnel.config.host + ":" + tunnel.config.remotePort + ":127.0.0.1:" + tunnel.config.localPort,
                            tunnel.config.username + "@" + tunnel.config.host
                    ], {
                        cwd : "ssh"
                    });
                tunnel.child = child;

                child.on("exit", function(code) {
                    tunnel.connected = false;
                    tunnel.child = undefined;
                });
                child.stdout.setEncoding('utf8');
                child.stdout.on("data", function(data) {
                    if(/.*@.*'s password:/.test(data)) {
                        child.kill("SIGINT");
                        tunnel.child = undefined;
                        tunnel.connected = false;
                        tunnel.flashMsg = "Wrong password of tunnel [" + i + "].";
                    }
                    console.log("std: " + data);
                });
                child.stderr.setEncoding('utf8');
                child.stderr.on("data", function(data) {
                    if(/Store key in cache\? \(y\/n\)/.test(data)) {
                        child.stdin.write("y\n");
                    } else {
                        child.kill("SIGINT");
                        tunnel.child = undefined;
                        tunnel.connected = false;
                        tunnel.flashMsg = "An error occurred while connecting to tunnel [" + i + "]: " + data;
                    }

                    console.log("err: " + data);
                });

                callback();
            })(i);

            return;
        }
    }

    callback(new Error("No such tunnel."));
};

/**
 * init the tunnels from file.
 * @returns {boolean}
 */
exports.init = function() {
    try {
        var json = fs.readFileSync("tunnels.json");
        json = JSON.parse(json);
    } catch(e) {
        return false;
    }

    tunnels = [];
    for(var i = 0; i < json.length; i++) {
        json[i].connected = undefined;
        var object = {
            config      : json[i],
            connected   : false
        };

        tunnels.push(object);
    }

    return true;
};

/**
 * get tunnels list (json)...
 * @returns {Array}
 */
exports.getList = function(flash) {
    var objects = [];
    for(var i = 0; i < tunnels.length; i++) {
        objects.push(Object.clone(tunnels[i].config, true));
        objects[objects.length - 1].connected = tunnels[i].connected;
        if(tunnels[i].flashMsg && flash) {
            objects[objects.length - 1].flashMsg = tunnels[i].flashMsg;
            tunnels[i].flashMsg = undefined;
        }
    }

    return objects;
};

/**
 * add a tunnel
 * @param host
 * @param remotePort
 * @param localPort
 * @param username
 * @param password
 */
exports.addTunnel = function(host, remotePort, localPort, username, password) {
    var config = {
        tunnelId    : moment().valueOf(),
        host        : host,
        remotePort  : remotePort,
        localPort   : localPort,
        username    : username,
        password    : password
    };

    var object = {
        config      : config,
        connected   : false
    };

    tunnels.push(object);

    var json = this.getList();

    fs.writeFile("tunnels.json", JSON.stringify(json));

    return json;
};
