"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Tours",
      [
        {
          name: "Sigiriya Rock Fortress Tour",
          slug: "sigiriya-rock-fortress-tour",
          duration: 2,
          maxGroupSize: 20,
          difficulty: "medium",
          ratingsAverage: 4.8,
          ratingsQuantity: 50,
          price: 150.0,
          priceDiscount: 130.0,
          summary: "Explore the ancient Sigiriya Rock Fortress in Sri Lanka.",
          description:
            "Join our expert guides on a two-day adventure to the majestic Sigiriya Rock Fortress. This tour includes a visit to the stunning ancient city and breathtaking views from the top of the rock.",
          imageCover: "sigiriya-cover.jpg",
          images: ["sigiriya1.jpg", "sigiriya2.jpg", "sigiriya3.jpg"],
          secretTour: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tours", null, {});
  },
};
