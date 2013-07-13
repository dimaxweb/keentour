var winston = require('winston'),
    CONFIG = require('config'),
    path = require('path')



var confTransports = CONFIG.logging;
var fileTransport = new (winston.transports.File)(confTransports.File);
/*
    give full path to file according to environment
 */
fileTransport.filename = path.join(process.cwd(),confTransports.File.filename);

var Logger = new (winston.Logger)({
    transports:[
        new (winston.transports.Console)(confTransports.Console),
        fileTransport
    ]
});

module.exports = Logger;






