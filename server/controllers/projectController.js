const pool = require('../config/db');

const createProject = async (req, res) => {
  const project = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (
        name, description, start_date, end_date, budget, benefits, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [project.name, project.description, project.start_date, project.end_date, project.budget, project.benefits, 'Active']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project' });
  }
};

const getProjects = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

module.exports = { createProject, getProjects };