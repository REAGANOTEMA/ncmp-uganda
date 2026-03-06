const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Make sure you have a Mongoose User model
require("dotenv").config();

/**
 * Helper: generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * @desc Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { full_name, email, nin, password, role } = req.body;

    // Validate required fields
    if (!full_name || !password || (!email && !nin)) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate NIN if citizen
    if (role === "citizen") {
      const NIN_REGEX = /^[A-Z]{2}\d{10}[A-Z]{2}$/;
      if (!NIN_REGEX.test(nin.toUpperCase())) {
        return res.status(400).json({ message: "Invalid NIN format." });
      }
      const existingUser = await User.findOne({ nin: nin.toUpperCase() });
      if (existingUser) {
        return res.status(400).json({ message: "NIN already registered." });
      }
    }

    // Validate email for officials
    if (role !== "citizen" && email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered." });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      full_name,
      email,
      nin: nin ? nin.toUpperCase() : undefined,
      role,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
        nin: newUser.nin,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

/**
 * @desc Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, nin, password } = req.body;

    // Find user by email or NIN
    const user = email
      ? await User.findOne({ email })
      : nin
      ? await User.findOne({ nin: nin.toUpperCase() })
      : null;

    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        nin: user.nin,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};