const express = require("express");
const morgan = require("morgan");

// Routers
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// Middleware Stack
if(process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  console.log("Hello from the middleware :p");
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Health ok !",
  });
});

// Mounting Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;