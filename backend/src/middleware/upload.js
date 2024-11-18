const fs = require('fs').promises;
const { upload, cloudinary } = require('../config/cloudinary');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const Car = require('../models/Car');

exports.uploadCarImages = upload.array('images', 10);

exports.processImages = catchAsync(async (req, res, next) => {
  if (req.method === 'PUT') {
    if (!req.files || req.files.length === 0) {
      return next();
    }
    
    const car = await Car.findById(req.params.id);
    if (car && (car.images.length + req.files.length) > 10) {
      return next(new ApiError(400, 'Maximum 10 images allowed per car'));
    }
  } else {
    if (!req.files || req.files.length === 0) {
      return next(new ApiError(400, 'Please upload at least one image'));
    }
    if (req.files.length > 10) {
      return next(new ApiError(400, 'Maximum 10 images allowed per car'));
    }
  }

  try {
    const uploadPromises = req.files.map(file => 
      cloudinary.uploader.upload(file.path, {
        folder: 'car-management',
        use_filename: true,
        unique_filename: true,
      })
    );

    const results = await Promise.all(uploadPromises);
    req.body.images = results.map(result => result.secure_url);
    await Promise.all(req.files.map(file => fs.unlink(file.path)));
    next();
  } catch (error) {
    await Promise.all(req.files.map(file => fs.unlink(file.path).catch(() => {})));
    next(new ApiError(500, 'Error uploading images'));
  }
});