/**
 * Created by XadillaX on 14-1-22.
 */
var helper = require("../helper");
var apiController = helper.common.getController("api");

exports.post = {
    "/api/add-tunnel"       : apiController.addTunnel,
    "/api/connect"          : apiController.connect,
    "/api/disconnect"       : apiController.disconnect,
    "/api/delete"           : apiController.delete
};

exports.get = {
    "/api/list"             : apiController.list
};
