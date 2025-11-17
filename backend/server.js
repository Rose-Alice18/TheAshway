const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const connectDatabase = require('./config/database');

const app = express();

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes (must come BEFORE static files)
const driverRoutes = require('./routes/drivers');
const vendorRoutes = require('./routes/vendors');
const deliveryRoutes = require('./routes/delivery');
const rideRoutes = require('./routes/rides');
const paymentRoutes = require('./routes/payments');

app.use('/api/drivers', driverRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve React app for any route that's not an API route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // Welcome route for development
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to The Ashway API! 🇬🇭',
      endpoints: {
        drivers: '/api/drivers',
        vendors: '/api/vendors',
        delivery: '/api/delivery',
        rides: '/api/rides',
        payments: '/api/payments',
      },
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 The Ashway server is running on port ${PORT}`);
  console.log(`🌍 Visit http://localhost:${PORT}`);
});
