const express = require('express');
const router = express.Router();
const { queryAll, queryOne, runQuery } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// GET /api/solutions
router.get('/', (req, res) => {
  try {
    const solutions = queryAll('SELECT * FROM solutions ORDER BY id ASC');
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/solutions/past
router.get('/past', (req, res) => {
  try {
    const past = queryAll('SELECT * FROM past_solutions ORDER BY year DESC');
    res.json(past);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/solutions/:id
router.get('/:id', (req, res) => {
  try {
    const solution = queryOne('SELECT * FROM solutions WHERE id = ?', [req.params.id]);
    if (!solution) return res.status(404).json({ message: 'Not found.' });
    res.json(solution);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/solutions — Admin: add solution
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, description, industry, icon } = req.body;
    if (!title || !description || !industry) {
      return res.status(400).json({ message: 'Title, description and industry are required.' });
    }
    const result = runQuery(
      'INSERT INTO solutions (title, description, industry, icon) VALUES (?, ?, ?, ?)',
      [title, description, industry, icon || 'FaRobot']
    );
    res.status(201).json({ message: 'Solution added.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/solutions/:id — Admin: update solution
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { title, description, industry, icon } = req.body;
    const existing = queryOne('SELECT * FROM solutions WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery(
      'UPDATE solutions SET title=?, description=?, industry=?, icon=? WHERE id=?',
      [title || existing.title, description || existing.description, industry || existing.industry, icon || existing.icon, req.params.id]
    );
    res.json({ message: 'Solution updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/solutions/:id — Admin: delete solution
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM solutions WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery('DELETE FROM solutions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Solution deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;