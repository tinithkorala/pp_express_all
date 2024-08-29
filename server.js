require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/postgres");
const colorLogger = require("./utils/colorLogger");

// Models
const tourModel = require("./models/tourModel");
const tourStartModel = require("./models/tourStartModel");

const port = process.env.PORT || 3000;

// Database Authentication
sequelize
  .sync()
  .then(() => {
    colorLogger("Database connected", "success");

    // Synchronizing All Models
    sequelize
      .sync()
      .then(() => colorLogger("Database Synchronized", "success"))
      .catch((error) =>
        colorLogger(`Database Synchronized Error : ${error.message}`)
      );

    // Server Listen
    app.listen(port, () => {
      colorLogger("Server is running on port ${port}", "success");
    });
  })
  .catch((error) =>
    colorLogger(`Unable to connect to the database: ${error.message}`, "error")
  );
