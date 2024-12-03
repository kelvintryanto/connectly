const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";

  if (err.name === "NotFound") {
    status = 404;
    message = `Data with id ${err.id} not found`;
  }
  if (err.name === "AlreadyJoin") {
    status = 403;
    message = `You Already Join `;
  }
  if (err.name == "SequelizeValidationError") {
    status = 400;
    message = err.errors[0].message;
  }

  if (err.name == "SequelizeUniqueConstraintError") {
    status = 400;
    message = err.errors[0].message;
  }

  if (err.name == "SequelizeDatabaseError" || err.name == "SequelizeForeignKeyConstraintError") {
    status = 400;
    message = "Invalid input";
  }

  if (err.name === `Forbidden`) {
    status = 403;
    message = `You dont have any Access`;
  }

  if (err.name === `BadRequest`) {
    status = 400;
    message = `Please Input email or password`;
  }

  if (err.name === `LoginError`) {
    status = 401;
    message = `error invalid username or invalid password`;
  }

  if (err.name === `Unauthorized` || err.name === `JsonWebTokenError`) {
    status = 401;
    message = `Please login first`;
  }

  res.status(status).json({
    message,
  });
};

module.exports = errorHandler;
