const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const carRoutes = require('./routes/car');
const authRoutes = require('./routes/auth');
const ApiError = require('./utils/apiError');
const errorHandler = require('./middleware/errorHandler');
const app = express();

// Update CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint at root level
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API Documentation',
    links: {
      postman: 'https://documenter.getpostman.com/view/39760977/2sAYBPmuYb',
      swagger: '/api/docs/swagger' // Optional: for future Swagger implementation
    }
  });
});

app.all('*', (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(errorHandler);

module.exports = app;