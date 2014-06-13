/**
 * Created by XadillaX on 14-1-22.
 */
var util = require("util");
var path = require("path");
var helper = require("../helper");

/**
 * initializing the router
 *     *recursion path supported.
 *
 * @param app
 * @param logger
 * @param callback
 */
exports.initializeRouter = function(app, logger, callback) {
    var commonController = helper.common.getController("common");
    var dirname = path.normalize(__dirname + "/../router/");

    var walk = require("walk");
    var walker = walk.walk(dirname);

    logger.info("Initializing the router...");
    walker.on("file", function(root, fileStats, next) {
        var pathname = root.substr(dirname.length);
        var router = require("../router" + pathname + "/" + fileStats.name);
        var postRouter = router.post;
        var getRouter = router.get;

        // proceed the post router
        if(undefined !== postRouter) {
            for(var key in postRouter) {
                logger.trace("Adding `" + key + "` to the post router...");

                // pretreatment
                app.post(key, commonController.pretreatment);

                if(typeof(postRouter[key]) === "function") {
                    app.post(key, postRouter[key]);
                } else if(util.isArray(postRouter[key])) {
                    for(var i = 0; i < postRouter[key].length; i++) {
                        app.post(key, postRouter[key][i]);
                    }
                }
                logger.trace("Added.");
            }
        }

        // proceed the get router
        if(undefined !== getRouter) {
            for(var key in getRouter) {
                logger.trace("Adding `" + key + "` to the get router...");

                // pretreatment
                app.get(key, commonController.pretreatment);

                if(typeof(getRouter[key]) === "function") {
                    app.get(key, getRouter[key]);
                } else if(util.isArray(getRouter[key])) {
                    for(var i = 0; i < getRouter[key].length; i++) {
                        app.get(key, getRouter[key][i]);
                    }
                }
                logger.trace("Added.");
            }
        }

        next();
    });

    walker.on("end", function() {
        logger.info("Initialized.");
        callback();
    })
};
