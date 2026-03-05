const express = require('express');
const router = express.Router();
const { getAllMPs, getMPById, updateMP } = require('../controllers/mpController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllMPs);
router.get('/:id', authenticateToken, getMPById);
router.put('/:id', authenticateToken, updateMP);

module.exports = router;