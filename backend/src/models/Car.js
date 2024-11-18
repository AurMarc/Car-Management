const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one image']
  }],
  tags: {
    car_type: {
      type: String,
      required: [true, 'Please provide car type']
    },
    company: {
      type: String,
      required: [true, 'Please provide company name']
    },
    dealer: {
      type: String,
      required: [true, 'Please provide dealer name']
    }
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Car must belong to a user']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

carSchema.index({ 
  title: 'text', 
  description: 'text',
  'tags.car_type': 'text',
  'tags.company': 'text',
  'tags.dealer': 'text'
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;