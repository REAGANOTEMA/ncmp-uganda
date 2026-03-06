// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load environment variables from .env
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const mpRoutes = require('./routes/mpRoutes');
const staffRoutes = require('./routes/staffRoutes');
const requestRoutes = require('./routes/requestRoutes');
const projectRoutes = require('./routes/projectRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin
app.use(express.json()); // Parse JSON payloads
app.use(morgan('dev')); // Logging HTTP requests for debugging

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: '✅ NCMP API is running',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/mps', mpRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: '❌ Route not found',
    route: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({
    error: '❌ Internal Server Error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NCMP API running on port ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`);
});