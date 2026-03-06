const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
========================
REGISTER USER
Handles Citizen / MP / Staff
========================
*/
exports.register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role,
      nin,
      phone,
      alt_phone,
      profile_photo,
    } = req.body;

    // Check if user with NIN or email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE nin=$1 OR email=$2",
      [nin, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User with this NIN or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await pool.query(
      `INSERT INTO users 
      (full_name, email, password_hash, role, nin, phone, profile_photo)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, full_name, email, role, nin, phone, profile_photo`,
      [full_name, email, hashedPassword, role || "citizen", nin, phone, profile_photo || null]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};


/*
========================
LOGIN USER
Supports login by NIN or Email
========================
*/
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // identifier can be NIN or email
    if (!identifier || !password) {
      return res.status(400).json({ message: "NIN/email and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE nin=$1 OR email=$1",
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        nin: user.nin,
        phone: user.phone,
        profile_photo: user.profile_photo || null,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};