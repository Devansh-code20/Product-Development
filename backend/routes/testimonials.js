const express = require('express');
const router = express.Router();
const { queryAll, queryOne, runQuery } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// GET /api/testimonials
router.get('/', (req, res) => {
  try {
    const testimonials = queryAll('SELECT * FROM testimonials ORDER BY id ASC');
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/testimonials — Admin: add testimonial
router.post('/', authMiddleware, (req, res) => {
  try {
    const { client_name, company, position, message, rating } = req.body;
    if (!client_name || !company || !position || !message || !rating) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const result = runQuery(
      'INSERT INTO testimonials (client_name, company, position, message, rating) VALUES (?, ?, ?, ?, ?)',
      [client_name, company, position, message, parseInt(rating)]
    );
    res.status(201).json({ message: 'Testimonial added.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/testimonials/:id — Admin: update
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { client_name, company, position, message, rating } = req.body;
    const existing = queryOne('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery(
      'UPDATE testimonials SET client_name=?, company=?, position=?, message=?, rating=? WHERE id=?',
      [client_name||existing.client_name, company||existing.company, position||existing.position, message||existing.message, rating||existing.rating, req.params.id]
    );
    res.json({ message: 'Testimonial updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/testimonials/:id — Admin: delete
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ message: 'Testimonial deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;