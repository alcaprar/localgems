'use strict'

const { format } = require('logform')

const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf((info) => {
    const { level, message, timestamp, ...meta } = info
    return `${timestamp} ${level}: ${message}. ${JSON.stringify(meta)}`
  })
)

export default {
  format: alignedWithColorsAndTime
}
