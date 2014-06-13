/**
 * Created by XadillaX on 14-1-24.
 */
/**
 * format one timestamp to a day string.
 * @param timestamp
 * @returns {String}
 */
exports.formatDay = function(timestamp) {
    var dateString = Date.create(timestamp * 1000).format("{yyyy}-{MM}-{dd}");
    return dateString;
};

/**
 * judge whether one string is a mongodb id.
 * @param _id
 * @returns {boolean}
 */
exports.isMongoId = function(_id) {
    if(typeof _id !== "string") {
        return false;
    }

    if(_id.length !== 24) {
        return false;
    }

    for(var i = 0; i < _id.length; i++) {
        if(_id[i] >= 'a' && _id[i] <= 'z') continue;
        if(_id[i] >= '0' && _id[i] <= '9') continue;

        return false;
    }

    return true;
};
