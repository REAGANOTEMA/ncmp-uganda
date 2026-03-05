const pool = require('../config/db');

const generateReport = async (req, res) => {
  const { type, startDate, endDate } = req.body;

  try {
    // Example: Requests by category
    if (type === 'requests_by_category') {
      const result = await pool.query(
        `SELECT category, COUNT(*) as total FROM requests WHERE date_submitted BETWEEN $1 AND $2 GROUP BY category`,
        [startDate, endDate]
      );
      return res.json(result.rows);
    }

    // Example: Project Completion
    if (type === 'project_completion') {
      const result = await pool.query(
        `SELECT name, (completed_tasks::float / total_tasks) * 100 as completion_rate FROM projects`
      );
      return res.json(result.rows);
    }

    res.status(400).json({ message: 'Invalid report type' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};

module.exports = { generateReport };