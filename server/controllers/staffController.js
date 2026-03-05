const pool = require('../config/db');

const addStaff = async (req, res) => {
  const staffData = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO staff (
        full_name, gender, dob, nin, phone, alt_phone, email, photo,
        district, constituency, subcounty, parish, village, physical_address,
        position, department, date_appointment, contract_type, employment_status, supervisor,
        username, password, role_level, access_permissions, salary_type, monthly_salary, mobile_money, bank_name, bank_account
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29
      ) RETURNING *`,
      [
        staffData.full_name, staffData.gender, staffData.dob, staffData.nin, staffData.phone, staffData.alt_phone, staffData.email, staffData.photo,
        staffData.district, staffData.constituency, staffData.subcounty, staffData.parish, staffData.village, staffData.physical_address,
        staffData.position, staffData.department, staffData.date_appointment, staffData.contract_type, staffData.employment_status, staffData.supervisor,
        staffData.username, staffData.password, staffData.role_level, JSON.stringify(staffData.access_permissions), staffData.salary_type, staffData.monthly_salary, staffData.mobile_money, staffData.bank_name, staffData.bank_account
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add staff' });
  }
};

const getStaff = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM staff ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
};

module.exports = { addStaff, getStaff };