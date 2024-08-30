const sequelize = require("./../config/postgres/index");

const Tour = require("./tourModel");
const TourStart = require("./tourStartModel");

// Define associations

// Tour
Tour.hasMany(TourStart, { foreignKey: "tour_id", as: "tourStarts" });

// TourStart
TourStart.belongsTo(Tour, { foreignKey: "tour_id", as: "tours" });

module.exports = {
  sequelize
};
