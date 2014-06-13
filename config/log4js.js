/**
 * Created by XadillaX on 14-1-22.
 */
function initializeLogger(environment) {
    var log4js = require("log4js");
    log4js.configure({
        appenders: [
            { type: "console" },
            {
                type: "file",
                filename: "logs/exframess.log",
                maxLogSize: 1024 * 1024 * 10,
                backups: 10,
                category: "yogarlife"
            }
        ],
        replaceConsole: true
    });

    var logger = log4js.getLogger("exframess");

    if(environment === "development") {
        logger.setLevel("TRACE");
    } else {
        logger.setLevel("DEBUG");
    }

    return logger;
}

module.exports = initializeLogger;
