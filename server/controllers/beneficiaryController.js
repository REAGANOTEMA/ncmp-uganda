const pool = require('../config/db');

const addBeneficiary = async (req, res) => {
  const beneficiary = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO beneficiaries (
        full_name, gender, dob, nin, phone, alt_phone, email, photo,
        district, constituency, subcounty, parish, village, physical_address,
        marital_status, occupation, employer, education_level, dependents,
        special_categories, request_types, registration_date, registered_by
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,$20,$21,$22,$23
      ) RETURNING *`,
      [
        beneficiary.full_name, beneficiary.gender, beneficiary.dob, beneficiary.nin, beneficiary.phone, beneficiary.alt_phone, beneficiary.email, beneficiary.photo,
        beneficiary.district, beneficiary.constituency, beneficiary.subcounty, beneficiary.parish, beneficiary.village, beneficiary.physical_address,
        beneficiary.marital_status, beneficiary.occupation, beneficiary.employer, beneficiary.education_level, beneficiary.dependents,
        JSON.stringify(beneficiary.special_categories), JSON.stringify(beneficiary.request_types), new Date(), beneficiary.registered_by
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add beneficiary' });
  }
};

const getBeneficiaries = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM beneficiaries ORDER BY registration_date DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch beneficiaries' });
  }
};

module.exports = { addBeneficiary, getBeneficiaries };