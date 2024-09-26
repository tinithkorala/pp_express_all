const { DataTypes, DATEONLY } = require("sequelize");
const sequelize = require("./../config/postgres");
const slugify = require("slugify");

const Tour = sequelize.define(
  "Tour",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isAlphanumeric: {
        msg: "A tour must have a name",
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isNumeric: {
        msg: "A tour must have a duration",
      },
    },
    maxGroupSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isNumeric: {
        msg: "A tour must have a group size",
      },
    },
    difficulty: {
      type: DataTypes.ENUM,
      values: ["easy", "medium", "difficult"],
      allowNull: false,
      validate: {
        isIn: {
          args: [["easy", "medium", "difficult"]],
          msg: "Difficulty is either: easy, medium, difficult",
        },
      },
    },
    ratingsAverage: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
      validate: {
        min: {
          args: [1],
          msg: "Rating must be above 1.0",
        },
        max: {
          args: [5],
          msg: "Rating must be below 5.0",
        },
      },
    },
    ratingsQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    priceDiscount: {
      type: DataTypes.FLOAT,
      validate: {
        customValidator(value) {
          if (value > this.price) {
            throw new Error("Discount price should be below regular price");
          }
        },
      },
    },
    summary: {
      type: DataTypes.STRING,
      isAlphanumeric: {
        msg: "A tour must have a description",
      },
    },
    description: {
      type: DataTypes.STRING,
    },
    imageCover: {
      type: DataTypes.STRING,
      isAlphanumeric: {
        msg: "A tour must have a cover image",
      },
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    startDates: {
      type: DataTypes.ARRAY(DataTypes.DATE()),
      allowNull: true,
    },
    secretTour: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Virtuals
    durationWeeks: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.duration / 7;
      },
      set() {
        throw new Error("Do not try to set the `durationWeeks` value!");
      },
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (tour, options) => {
        if (tour.name) {
          tour.slug = slugify(tour.name, {
            replacement: "-",
            lower: true,
          });
        } else {
          throw new Error("Tour name is required to generate slug");
        }
      },
    },
  }
);

module.exports = Tour;
