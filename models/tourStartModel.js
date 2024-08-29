const { DataTypes } = require("sequelize");
const sequelize = require("./../config/postgres");
const Tour = require("./tourModel");

const TourStart = sequelize.define(
  "TourStart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tour_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Tour,
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATE,
    },
  },
  { timestamps: true }
);

module.exports = TourStart;