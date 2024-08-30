"use strict";

const fs = require("fs");
const path = require("path");
const TourStart = require("../models/tourStartModel");
const Tour = require("../models/tourModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Read data from json
    const tourData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/Tours.json"), "utf-8")
    );
    for (const tour of tourData) {
      const createdTour = await Tour.create({
        name: tour.name,
        slug: tour.slug,
        duration: tour.duration,
        maxGroupSize: tour.maxGroupSize,
        difficulty: tour.difficulty,
        ratingsAverage: tour.ratingsAverage,
        ratingsQuantity: tour.ratingsQuantity,
        price: tour.price,
        priceDiscount: tour.priceDiscount,
        summary: tour.summary,
        description: tour.description,
        imageCover: tour.imageCover,
        images: tour.images,
        secretTour: tour.secretTour,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create the associated TourStart records
      const tourStarts = tour.startDates.map((date) => ({
        start_date: new Date(date),
        tour_id: createdTour.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await TourStart.bulkCreate(tourStarts);
    }
  },

  async down(queryInterface, Sequelize) {
    await TourStart.destroy({ where: {} });
    await Tour.destroy({ where: {} });
  },
};
