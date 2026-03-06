const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // your MongoDB or SQL user model
const { body, validationResult } = require('express-validator');

// Regex for Uganda NIN (e.g., CM9801910356YD)
const NIN_REGEX = /^[A-Z]{2}\d{10}[A-Z]{2}$/;

// ===============================
// REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    const { full_name, email, nin, password, role } = req.body;

    // Basic validation
    if (!full_name || !password || !role) {
      return res.status(400).json({ message: 'Full name, password, and role are required' });
    }

    // Citizen must provide valid NIN
    if (role === 'citizen') {
      if (!nin || !NIN_REGEX.test(nin)) {
        return res.status(400).json({ message: 'Invalid NIN format. Example: CM9801910356YD' });
      }
      const existingCitizen = await User.findOne({ nin });
      if (existingCitizen) {
        return res.status(409).json({ message: 'NIN already registered' });
      }
    } else {
      // Officials must provide valid email
      if (!email) {
        return res.status(400).json({ message: 'Email is required for officials' });
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already registered' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      full_name,
      email: email || undefined,
      nin: nin || undefined,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, nin, password } = req.body;

    // Identify user
    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ nin });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password before sending user object
    const userSafe = {
      id: user._id,
      full_name: user.full_name,
      email: user.email,
      nin: user.nin,
      role: user.role,
    };

    res.status(200).json({ token, user: userSafe });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};