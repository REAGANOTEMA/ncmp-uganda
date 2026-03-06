const pool = require('../config/db'); // PostgreSQL pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Helper: Validate NIN format
const isValidNIN = (nin) => {
  // Example: Uganda NIN format CM9801910356YD (2 letters, 6 digits, 2 letters)
  const regex = /^[A-Z]{2}\d{10}[A-Z]{2}$/;
  return regex.test(nin);
};

// ==========================
// REGISTER USER
// ==========================
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role, nin, phone } = req.body;

    if (!full_name || !password || (!email && !nin)) {
      return res.status(400).json({ message: 'Name, password, and email or NIN are required' });
    }

    if (nin && !isValidNIN(nin)) {
      return res.status(400).json({ message: 'Invalid NIN format' });
    }

    // Check for existing user by NIN or email
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE nin=$1 OR email=$2',
      [nin || '', email || '']
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this NIN or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, nin, phone)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, full_name, email, role, nin, phone`,
      [full_name, email || null, hashedPassword, role || 'citizen', nin || null, phone || null]
    );

    const user = result.rows[0];

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// ==========================
// LOGIN USER
// ==========================
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'NIN/email and password are required' });
    }

    // Find user by NIN or email
    const result = await pool.query(
      'SELECT * FROM users WHERE nin=$1 OR email=$1',
      [identifier]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        nin: user.nin,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};