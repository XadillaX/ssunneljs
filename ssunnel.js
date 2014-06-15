/**
 * Ex(frame)ss.js Main file.
 */
require("sugar");
var express = require("express");
var http = require("http");
var path = require("path");
var async = require("async");
var config = require("./config");

// if mongodb is configured.
if(config.mongodb) {
    var MongoStore = require("connect-mongo")(express);
    var mongodbConnect = require("./model/base/mongodb").connect;
}

var app = express();

async.waterfall([
    /**
     * setp 1:
     *   set express configurations.
     *
     * @param callback
     */
    function(callback) {
        /**
         * environment & error handler
         */
        if("development" === config.server.environment) {
            app.use(express.errorHandler());
        }

        app.set("port", config.server.port);
        app.set("views", __dirname + "/template");
        app.set("view engine", "ejs");

        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.bodyParser({ uploadDir: config.upload.tempDir }));
        app.use(express.cookieParser(config.secret.cookie));

        // if mongodb is configured.
        if(config.mongodb) {
            app.use(express.session({
                secret: config.secret.cookie,
                store: new MongoStore({
                    host: config.mongodb.hostname,
                    port: config.mongodb.port,
                    db: config.mongodb.dbname,
                    collection: "session",

                    auto_reconnect: true
                })
            }));
        }
        app.use(app.router);
        app.use(express.static(path.join(__dirname, "/statics")));

        callback();
    },

    /**
     * step 2:
     *   initialize the router.
     *
     * @param callback
     */
    function(callback) {
        config.router.initializeRouter(app, config.logger, callback)
    },

    /**
     * step 3:
     *   tunnels initializion...
     *
     * @param callback
     */
    function(callback) {
        var tunnelModel = require("./model/tunnelModel");
        tunnelModel.init();
        callback();
    },
], function(err) {
    if(err) {
        return console.log("An error occurred while initialing the system: " + err.message);
    }

    http.createServer(app).listen(app.get("port"), function() {
        console.log("Ex(frame)ss server started at 0.0.0.0:" + app.get("port") + ".");
    });
});
