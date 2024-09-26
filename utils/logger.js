const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, colorize, printf } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

// Custom format for file logging to capture error stack
const fileLogFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({
      filename: "log/app.log",
      format: combine(timestamp(), fileLogFormat),
    }),
  ],
});

module.exports = logger;
