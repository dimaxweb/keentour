var winston = require('winston'),
    CONFIG = require('config'),
    path = require('path'),
    _ = require('underscore')


var ConfigClone = _.clone(CONFIG);
var confTransports = ConfigClone.logging;
confTransports.File.filename = path.join(process.cwd(),confTransports.File.filename);
var Logger = new (winston.Logger)({
    transports:[
        new (winston.transports.Console)(confTransports.Console),
        new (winston.transports.File)(confTransports.File)
    ]
});

module.exports = Logger;






