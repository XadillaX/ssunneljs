/**
 * Created by XadillaX on 14-3-14.
 */
var config = require("../config");
var helper = {};
helper.common = require("../helper/common");

/**
 * pretreatment function.
 * @param req
 * @param resp
 * @param next
 */
exports.pretreatment = function(req, resp, next) {
    var startProcessTime = Date.now();

    // clone the render data.
    req.renderData = Object.clone(config.renderData, true);
    req.renderData.startProcessTime = startProcessTime;

    // log
    var log = "[" + helper.common.getIp(req) + "] visited \"" + req.originalUrl + "\" 【" + req.headers["user-agent"] + "】";
    config.logger.debug(log);

    next();
};
