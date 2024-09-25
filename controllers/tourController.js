const { Op } = require("sequelize");

const sequelize = require("../config/postgres");
const Tour = require("../models/tourModel");
const TourStart = require("../models/tourStartModel");

exports.aliasTopTours = (req, res, next) => {
  // limit=5&sort=-ratingsAverage,price
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,duration,difficulty,price,ratingsAverage";
  next();
};

exports.getAllTours = async (req, res, next) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    console.log(queryObj);

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering - Handle different operators
    const operatorsMap = {
      gt: Op.gt,
      gte: Op.gte,
      lt: Op.lt,
      lte: Op.lte,
      ne: Op.ne,
    };
    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === "object") {
        Object.keys(queryObj[key]).forEach((opKey) => {
          if (operatorsMap[opKey]) {
            queryObj[key] = { [operatorsMap[opKey]]: queryObj[key][opKey] };
          }
        });
      }
    });

    // Sorting
    const sortBy = req.query.sort;
    let order = [];

    if (sortBy) {
      const sortFields = sortBy.split(",");
      order = sortFields.map((field) => {
        if (field.startsWith("-")) {
          return [field.slice(1), "DESC"];
        }
        return [field, "ASC"];
      });
    }

    // Field Limiting
    const fields = req.query.fields;
    const selectedFields = fields ? fields.split(",") : null;

    // Pagination
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;

    const tours = await Tour.findAll({
      include: [
        {
          model: TourStart,
          as: "tourStarts",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      where: queryObj,
      order: order,
      attributes: selectedFields,
      limit: limit,
      offset: offset,
    });

    const totalTours = await Tour.count({ where: queryObj });

    res.status(200).json({
      status: "success",
      message: "getAllTours",
      results: tours.length,
      totalResults: totalTours,
      totalPages: Math.ceil(totalTours / limit),
      currentPage: page,
      data: {
        tours,
      },
    });
  } catch (error) {
    console.log(error);
  }
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
