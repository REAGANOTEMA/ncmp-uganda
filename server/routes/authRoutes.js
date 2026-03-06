const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/*
========================
Auth Routes
========================
*/

// Register a new user (Citizen / MP / Staff)
router.post("/register", authController.register);

// Login user (NIN or Email)
router.post("/login", authController.login);

module.exports = router;