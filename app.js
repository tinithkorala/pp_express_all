const express = require("express");

const loggerMorganMiddleware = require("./middleware/loggerMorganMiddleware");

// Routers
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const logger = require("./utils/logger");

const app = express();

// Middleware Stack
app.use(express.json());

app.use(loggerMorganMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Health ok !",
  });
});

app.get("/error", (req, res) => {
  try {
    throw new Error('This is test error');
  } catch (error) {
    logger.error({message: error.message, stack: error.stack})
  }
  res.status(404).json({
    status: "fail",
    message: "fail ok !",
  });
});

// Mounting Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
