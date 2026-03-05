const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const mpRoutes = require('./routes/mpRoutes');
const staffRoutes = require('./routes/staffRoutes');
const requestRoutes = require('./routes/requestRoutes');
const projectRoutes = require('./routes/projectRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mps', mpRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));