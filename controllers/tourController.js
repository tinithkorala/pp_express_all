exports.getAllTours = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "getAllTours",
  });
};

exports.createTour = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "createTour",
  });
};

exports.getTour = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "getTour",
  });
};

exports.updateTour = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "updateTour",
  });
};

exports.deleteTour = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "deleteTour",
  });
};
