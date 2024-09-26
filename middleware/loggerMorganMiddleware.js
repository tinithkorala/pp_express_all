const morgan = require("morgan");
const logger = require("../utils/logger");

// Define morgan format
const morganFormat = ":method :url :status :response-time ms";

const loggerMorganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3],
      };
      logger.info(JSON.stringify(logObject));
    },
  },
});

module.exports = loggerMorganMiddleware;
