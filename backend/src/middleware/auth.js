const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');

const invalidTokens = new Set();

exports.invalidateToken = (token) => {
  invalidTokens.add(token);
};

const isTokenInvalid = (token) => {
  return invalidTokens.has(token);
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Please log in to access this resource'));
  }

  if (isTokenInvalid(token)) {
    return next(new ApiError(401, 'Token is no longer valid. Please log in again.'));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ApiError(401, 'The user no longer exists'));
  }

  req.user = user;
  req.token = token;
  next();
});