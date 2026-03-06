const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

/*
============================
REGISTER
============================
*/
exports.register = async (req, res) => {
  try {
    const { full_name, email, nin, password, role } = req.body;

    if (!full_name || !password) {
      return res.status(400).json({ message: "Full name and password required." });
    }

    if (!email && !nin) {
      return res.status(400).json({ message: "Email or NIN required." });
    }

    // check existing user
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR nin=$2",
      [email || null, nin || null]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (full_name,email,nin,password,role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id,full_name,email,nin,role`,
      [
        full_name,
        email || null,
        nin || null,
        hashedPassword,
        role || "citizen",
      ]
    );

    res.status(201).json({
      message: "Registration successful",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

/*
============================
LOGIN
============================
*/
exports.login = async (req, res) => {
  try {
    const { email, nin, password } = req.body;

    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR nin=$2",
      [email || null, nin || null]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    const user = userQuery.rows[0];

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        nin: user.nin,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed." });
  }
};