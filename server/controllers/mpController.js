const pool = require('../config/db');

const getAllMPs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mps ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch MPs' });
  }
};

const getMPById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM mps WHERE id=$1', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch MP' });
  }
};

const updateMP = async (req, res) => {
  const { id } = req.params;
  const { name, email, photo } = req.body;
  try {
    const result = await pool.query(
      'UPDATE mps SET name=$1, email=$2, photo=$3 WHERE id=$4 RETURNING *',
      [name, email, photo, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update MP' });
  }
};

module.exports = { getAllMPs, getMPById, updateMP };