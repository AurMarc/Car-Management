const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadCarImages, processImages } = require('../middleware/upload');
const {
  createCar,
  getMyCars,
  getCar,
  updateCar,
  deleteCar,
  removeImage,
  searchCars
} = require('../controllers/carController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyCars)
  .post(uploadCarImages, processImages, createCar);

router.get('/search', searchCars);

router.route('/:id')
  .get(getCar)
  .put(uploadCarImages, processImages, updateCar)
  .delete(deleteCar);

router.delete('/:id/images', removeImage);

module.exports = router;