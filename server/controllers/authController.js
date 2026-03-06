const usersDB = []; // replace with real DB in production
const jwt = require('jsonwebtoken');

/*
==============================
NIN Validation
==============================
Uganda NIN format: 
Example: CM9801910356YD, CF9900810CA5DA
Regex allows two letters, 10 digits, two letters
*/
const validateNIN = (nin) => /^[A-Z]{2}\d{10}[A-Z]{2}$/.test(nin);

/*
==============================
Register User
==============================
*/
const registerUser = (req, res) => {
  const { full_name, email, nin, password, role } = req.body;

  if (!full_name || !password || !role) {
    return res.status(400).json({ message: 'Full name, password, and role are required.' });
  }

  // Citizen NIN validation
  if (role === 'citizen') {
    if (!nin) return res.status(400).json({ message: 'NIN is required for citizens.' });
    if (!validateNIN(nin)) return res.status(400).json({ message: 'Invalid NIN format.' });

    // Check if NIN exists
    if (usersDB.find(u => u.nin === nin)) {
      return res.status(400).json({ message: 'NIN already registered.' });
    }
  } else {
    // Official Email validation
    if (!email) return res.status(400).json({ message: 'Email is required for officials.' });
    if (usersDB.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
  }

  // Save user
  const newUser = {
    id: (usersDB.length + 1).toString(),
    full_name,
    email: email || null,
    nin: nin || null,
    role,
    password, // NOTE: in production, hash passwords!
  };
  usersDB.push(newUser);

  // Generate JWT
  const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

  res.status(201).json({ token, user: newUser });
};

/*
==============================
Login User
==============================
*/
const loginUser = (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required.' });
  }

  const user = usersDB.find(u =>
    (u.email === identifier || u.nin === identifier) && u.password === password
  );

  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

  res.status(200).json({ token, user });
};

module.exports = { registerUser, loginUser };