const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.code === 11000) {
    err = new ApiError(400, 'Duplicate field value entered');
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    err = new ApiError(400, `Invalid input data. ${errors.join('. ')}`);
  }

  if (err.name === 'JsonWebTokenError') {
    err = new ApiError(401, 'Invalid token. Please log in again.');
  }

  if (err.name === 'TokenExpiredError') {
    err = new ApiError(401, 'Your token has expired! Please log in again.');
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;