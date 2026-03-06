const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const mpRoutes = require('./routes/mpRoutes');
const staffRoutes = require('./routes/staffRoutes');
const requestRoutes = require('./routes/requestRoutes');
const projectRoutes = require('./routes/projectRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'API is running ✅',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==========================
// API Routes
// ==========================
app.use('/api/auth', authRoutes);           // Auth: login/register
app.use('/api/mps', mpRoutes);             // MPs
app.use('/api/staff', staffRoutes);         // Staff
app.use('/api/requests', requestRoutes);   // Citizen requests
app.use('/api/projects', projectRoutes);   // Projects
app.use('/api/beneficiaries', beneficiaryRoutes); // Beneficiaries
app.use('/api/reports', reportRoutes);     // Reports & analytics

// ==========================
// Serve React Frontend
// ==========================
const reactBuildPath = path.join(__dirname, 'client', 'dist'); // change if build folder differs
app.use(express.static(reactBuildPath));

// Serve index.html for all frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(reactBuildPath, 'index.html'));
});

// ==========================
// 404 Handler
// ==========================
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found ❌' });
});

// ==========================
// Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong ❌',
    details: err.message
  });
});

// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`);
});