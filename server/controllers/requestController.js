const pool = require('../config/db');

const addRequest = async (req, res) => {
  const request = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO requests (
        beneficiary_id, title, description, category, priority, status, submitted_by, date_submitted, supporting_documents
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [request.beneficiary_id, request.title, request.description, request.category, request.priority, 'Pending', request.submitted_by, new Date(), JSON.stringify(request.supporting_documents)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add request' });
  }
};

const getRequests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requests ORDER BY date_submitted DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

module.exports = { addRequest, getRequests };