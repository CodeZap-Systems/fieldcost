require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
const driversRoutes = require('./routes/drivers');

const app = express();

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins in dev
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LaundryFlow SA',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/drivers', driversRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date()
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 LaundryFlow SA server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}`);
});

module.exports = app;
