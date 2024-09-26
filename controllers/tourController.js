const sequelize = require("../config/postgres");
const Tour = require("../models/tourModel");
const TourStart = require("../models/tourStartModel");
const APIQueryBuilder = require("../utils/APIQueryBuilder");

const { fn, col, literal } = require("sequelize");

exports.aliasTopTours = (req, res, next) => {
  // limit=5&sort=-ratingsAverage,price
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,duration,difficulty,price,ratingsAverage";
  next();
};

exports.getAllTours = async (req, res, next) => {
  try {
    const APIQueryBuilderObj = new APIQueryBuilder({}, req.query);
    const queryBuilder = APIQueryBuilderObj.filter()
      .sort()
      .limitFields()
      .paginate();
    const { where, order, attributes, limit, offset, page } =
      queryBuilder.query;

    console.log(queryBuilder);

    const tours = await Tour.findAll({
      include: [
        {
          model: TourStart,
          as: "tourStarts",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      where,
      order,
      attributes,
      limit,
      offset,
    });

    const totalTours = await Tour.count({ where });

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

  console.log(updatedTourdata.price);

  const tour = await Tour.findByPk(id);

  if (updatedTourdata.version !== tour.version) {
    return res.status(200).json({
      status: "fail",
      message: "Version is mismatch",
    });
  }

  tour.price = updatedTourdata.price; 
  tour.version += 1;
  await tour.save();

  res.status(200).json({
    status: "success",
    message: "updateTour",
    data: {
      tour: tour,
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

exports.getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "tour_count"],
        [
          sequelize.fn("AVG", sequelize.col("ratingsQuantity")),
          "ratings_quantity",
        ],
        [
          sequelize.fn("AVG", sequelize.col("ratingsAverage")),
          "ratings_average",
        ],
        [sequelize.fn("AVG", sequelize.col("price")), "avg_price"],
        [sequelize.fn("MIN", sequelize.col("price")), "min_price"],
        [sequelize.fn("MAX", sequelize.col("price")), "max_price"],
      ],
      group: ["difficulty"],
      order: [[sequelize.col("avg_price")]],
      raw: true,
    });
    res.status(200).json({
      status: "success",
      message: "stats",
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
    console.log(error);
  }
};

exports.getMonthlyPlan = async (req, res, next) => {
  try {
    const year = req.params.year;
    const plan = await TourStart.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("TourStart.start_date")), "month"], // Group by month from TourStart
        [fn("COUNT", col("TourStart.id")), "tourStartCount"], // Count of TourStart records per month
      ],
      include: [
        {
          model: Tour,
          as: "tours",
          attributes: [
            ["id", "tourId"], // Alias to avoid ambiguity
            "name",
            "price",
          ],
        },
      ],
      group: [literal("month"), col("tours.id")], // Explicitly use 'tours.id' for grouping
      order: [[literal("month"), "ASC"]], // Order by month
    });

    res.status(200).json({
      status: "success",
      message: "plan",
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
    console.log(error);
  }
};
