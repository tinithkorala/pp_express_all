require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models/associations");
const colorLogger = require("./utils/colorLogger");

const port = process.env.PORT || 3000;

// Database Authentication
sequelize
  .sync()
  .then(() => {
    colorLogger("Database connected", "success");
    colorLogger("Database Synchronized", "success");
    // Server Listen
    app.listen(port, () => {
      colorLogger(`Server is running on port ${port}`, "success");
    });
  })
  .catch((error) => {
    colorLogger(`Unable to connect to the database: ${error.message}`, "error");
    colorLogger(`Database Synchronized Error : ${error.message}`);
  });
