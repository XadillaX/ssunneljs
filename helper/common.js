/**
 * Created by XadillaX on 14-1-22.
 */
var controllerCache = {};
var modelCache = {};

/**
 * empty function
 */
exports.emptyFunc = function() {};

/**
 * get ip (nginx and cloudflare forward included.)
 * @param req
 * @returns String
 */
exports.getIp = function(req) {
    if(req.headers["cf-connecting-ip"]) {
        return req.headers["cf-connecting-ip"];
    } else if(req.headers["x-real-ip"]) {
        return req.headers["x-real-ip"];
    } else {
        return req.ip;
    }
};

/**
 * alert
 * @param msg
 * @param url
 * @param resp
 */
exports.alert = function(msg, url, resp) {
    var html = "<script>";
    html += "alert('" + msg + "');";
    html += "window.location.href = \"" + url + "\";";
    html += "</script>";
    resp.send(200, html);
};

/**
 * alert back.
 * @param msg
 * @param resp
 * @param [step]
 */
exports.alertBack = function(msg, resp, step) {
    if(undefined === step || isNaN(parseInt(step))) {
        step = 1;
    } else {
        step = parseInt(step);
    }

    var html = "<script>";
    html += "alert('" + msg + "');";
    html += "window.history.go(-" + step + ");";
    html += "</script>";
    resp.send(200, html);
};

/**
 * get time stamp
 * @param [time]
 * @returns {Number}
 */
exports.timestamp = function(time) {
    if(time === undefined) {
        time = Date.now();
    }

    return parseInt(time / 1000);
};

/**
 * get a new model
 * @param modelName
 * @returns Model
 */
exports.getModel = function(modelName) {
    if(undefined === modelCache[modelName]) {
        var filename = "../model/" + modelName + "Model";
        var model = null;

        try {
            model = require(filename);
        } catch (e) {
            console.log(e);
            model = null;
            return null;
        }

        modelCache[modelName] = model;
    }

    return new modelCache[modelName]();
};

/**
 * get a controller
 * @param controllerName
 * @returns Controller
 */
exports.getController = function(controllerName) {
    if(undefined === controllerCache[controllerName]) {
        var filename = "../controller/" + controllerName + "Controller";
        var controller = null;

        try {
            controller = require(filename);
        } catch(e) {
            console.error("An error occurred while creating controller `" + controller + "`: " + e.message);
            controller = null;
            return controller;
        }

        controllerCache[controllerName] = controller;
    }

    return controllerCache[controllerName];
};
