'use strict'

const winston = require('winston')
const config = {}

config.port = process.env.PORT || 3000
config.logger = new winston.Logger({
    transports : [
        new (winston.transports.Console)({
            level : 'debug'
        }),
        new (winston.transports.File)({
            name : 'amadeus-response',
            filename : 'response.json',
            level : process.env.LOG_LEVEL || 'info'
        })
    ]
})

module.exports = config
