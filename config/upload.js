/**
 * Created by XadillaX on 14-2-10.
 */
var path = require("path");

module.exports = {
    tempDir     : path.join(__dirname, "../uploadTemp"),
    uploadDir   : path.join(__dirname, "../attachement"),
    maxSize     : 1024 * 1024 * 10
};
