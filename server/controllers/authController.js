const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
REGISTER USER
Citizen / MP / Staff
*/
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role, nin, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      `INSERT INTO users (full_name,email,password_hash,role,nin,phone)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id,full_name,email,role,nin,phone`,
      [full_name, email, hashedPassword, role || "citizen", nin, phone]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: user.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};


/*
LOGIN USER
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

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
        name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};