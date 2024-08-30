const sequelize = require("../config/postgres");
const Tour = require("../models/tourModel");
const TourStart = require("../models/tourStartModel");

exports.getAllTours = async (req, res, next) => {
  const tours = await Tour.findAll({
    include: [
      {
        model: TourStart,
        as: "tourStarts",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });
  res.status(200).json({
    status: "success",
    message: "getAllTours",
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.createTour = async (req, res, next) => {
  const tourData = req.body;

  const transaction = await sequelize.transaction();

  try {
    const newTour = await Tour.create(
      {
        name: tourData.name,
        slug: tourData.slug,
        duration: tourData.duration,
        maxGroupSize: tourData.maxGroupSize,
        difficulty: tourData.difficulty,
        ratingsAverage: tourData.ratingsAverage,
        ratingsQuantity: tourData.ratingsQuantity,
        price: tourData.price,
        priceDiscount: tourData.priceDiscount,
        summary: tourData.summary,
        description: tourData.description,
        imageCover: tourData.imageCover,
        images: tourData.images,
        startDates: tourData.startDates,
        secretTour: tourData.secretTour,
      },
      { transaction }
    );
    if (tourData.startDates) {
      const startDatePromises = tourData.startDates.map((startDate) => {
        return TourStart.create(
          {
            tour_id: newTour.id,
            start_date: startDate,
          },
          { transaction }
        );
      });

      await Promise.all(startDatePromises);
    }
    await transaction.commit();
    res.status(200).json({
      status: "success",
      message: "createTour",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      status: "fail",
      message: "Failed to create tour",
      error: error.message,
    });
    console.log(error);
  }
};

exports.getTour = async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByPk(id);
  res.status(200).json({
    status: "success",
    message: "getTour",
    data: {
      tour,
    },
  });
};

exports.updateTour = async (req, res, next) => {
  const { id } = req.params;
  const updatedTourdata = req.body;
  const [updatedRecordCount, updatedRecords] = await Tour.update(
    { price: updatedTourdata.price },
    { where: { id: id }, returning: true }
  );
  res.status(200).json({
    status: "success",
    message: "updateTour",
    data: {
      tour: updatedRecords,
    },
  });
};

exports.deleteTour = async (req, res, next) => {
  const { id } = req.params;
  await Tour.destroy({ where: { id: id } });
  res.status(204).json({
    status: "success",
    message: "deleteTour",
  });
};
