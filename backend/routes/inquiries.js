const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { queryAll, queryOne, runQuery } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Validation rules for contact form
const inquiryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required.').isLength({ max: 20 }),
  body('company_name').trim().notEmpty().withMessage('Company name is required.').isLength({ max: 150 }),
  body('country').trim().notEmpty().withMessage('Country is required.').isLength({ max: 100 }),
  body('job_title').trim().notEmpty().withMessage('Job title is required.').isLength({ max: 100 }),
  body('job_details').trim().notEmpty().withMessage('Job details are required.').isLength({ max: 2000 }),
];

// POST /api/inquiries - Submit contact form (public)
router.post('/', inquiryValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, company_name, country, job_title, job_details } = req.body;

    const result = runQuery(
      `INSERT INTO inquiries (name, email, phone, company_name, country, job_title, job_details)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, company_name, country, job_title, job_details]
    );

    res.status(201).json({
      message: 'Your enquiry has been submitted successfully. We will be in touch shortly.',
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Inquiry submission error:', err);
    res.status(500).json({ message: 'Failed to submit enquiry. Please try again.' });
  }
});

// GET /api/inquiries - Admin: Get all inquiries with stats (protected)
router.get('/', authMiddleware, (req, res) => {
  try {
    const inquiries = queryAll('SELECT * FROM inquiries ORDER BY created_at DESC');

    // Statistics
    const totalCount = inquiries.length;

    // Count by country
    const byCountry = {};
    inquiries.forEach(i => {
      byCountry[i.country] = (byCountry[i.country] || 0) + 1;
    });

    // Count by month (last 6 months)
    const byMonth = {};
    inquiries.forEach(i => {
      const month = i.created_at ? i.created_at.substring(0, 7) : 'Unknown';
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    // Top companies
    const byCompany = {};
    inquiries.forEach(i => {
      byCompany[i.company_name] = (byCompany[i.company_name] || 0) + 1;
    });

    res.json({
      inquiries,
      stats: {
        total: totalCount,
        byCountry,
        byMonth,
        byCompany
      }
    });
  } catch (err) {
    console.error('Fetch inquiries error:', err);
    res.status(500).json({ message: 'Failed to fetch inquiries.' });
  }
});

// GET /api/inquiries/:id - Admin: Get single inquiry (protected)
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const inquiry = queryOne('SELECT * FROM inquiries WHERE id = ?', [req.params.id]);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/inquiries/:id - Admin: Delete inquiry (protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const inquiry = queryOne('SELECT * FROM inquiries WHERE id = ?', [req.params.id]);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    runQuery('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Inquiry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
