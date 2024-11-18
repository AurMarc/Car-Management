const Car = require('../models/Car');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const { deleteFile } = require('../utils/fileHelper');

exports.getMyCars = catchAsync(async (req, res) => {
  const cars = await Car.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    status: 'success',
    results: cars.length,
    data: { cars }
  });
});

exports.getCar = catchAsync(async (req, res, next) => {
  const car = await Car.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!car) {
    return next(new ApiError(404, 'No car found with that ID'));
  }

  res.status(200).json({
    status: 'success',
    data: { car }
  });
});

exports.createCar = catchAsync(async (req, res, next) => {
  if (!req.body.images || req.body.images.length === 0) {
    return next(new ApiError(400, 'Please provide at least one image'));
  }

  if (req.body.images.length > 10) {
    return next(new ApiError(400, 'Maximum 10 images allowed'));
  }

  const car = await Car.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: { car }
  });
});

exports.updateCar = catchAsync(async (req, res, next) => {
  const existingCar = await Car.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!existingCar) {
    return next(new ApiError(404, 'No car found with that ID'));
  }

  const updateData = {
    title: req.body.title || existingCar.title,
    description: req.body.description || existingCar.description,
    tags: {
      car_type: req.body.tags?.car_type || existingCar.tags.car_type,
      company: req.body.tags?.company || existingCar.tags.company,
      dealer: req.body.tags?.dealer || existingCar.tags.dealer
    }
  };

  // Only update images if new ones are provided
  if (req.body.images) {
    updateData.images = req.body.images;
  }

  const car = await Car.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id
    },
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: { car }
  });
});

exports.deleteCar = catchAsync(async (req, res, next) => {
  const car = await Car.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!car) {
    return next(new ApiError(404, 'No car found with that ID'));
  }

  for (const image of car.images) {
    try {
      await deleteFile(image);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.removeImage = catchAsync(async (req, res, next) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return next(new ApiError(400, 'Image URL is required'));
  }

  const car = await Car.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
      images: imageUrl
    },
    { $pull: { images: imageUrl } },
    { new: true }
  );

  if (!car) {
    return next(new ApiError(404, 'Car or image not found'));
  }

  try {
    await deleteFile(imageUrl);
  } catch (error) {
    console.error('Error deleting file:', error);
  }

  res.status(200).json({
    status: 'success',
    data: { car }
  });
});

exports.searchCars = catchAsync(async (req, res) => {
  const query = req.query.q || '';
  const searchRegex = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
  
  const cars = await Car.find({
    user: req.user._id,
    $or: [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { 'tags.car_type': { $regex: searchRegex } },
      { 'tags.company': { $regex: searchRegex } },
      { 'tags.dealer': { $regex: searchRegex } }
    ]
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: cars.length,
    data: { cars }
  });
});