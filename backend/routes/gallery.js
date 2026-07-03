const express = require('express');
const router = express.Router();
const { queryAll, queryOne, runQuery } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// GET /api/gallery
router.get('/', (req, res) => {
  try {
    const gallery = queryAll('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/gallery — Admin: add gallery item
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, image_url, event_name } = req.body;
    if (!title || !image_url || !event_name) {
      return res.status(400).json({ message: 'Title, image URL and event name are required.' });
    }
    const result = runQuery(
      'INSERT INTO gallery (title, image_url, event_name) VALUES (?, ?, ?)',
      [title, image_url, event_name]
    );
    res.status(201).json({ message: 'Gallery item added.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/gallery/:id — Admin: update gallery item
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { title, image_url, event_name } = req.body;
    const existing = queryOne('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery(
      'UPDATE gallery SET title=?, image_url=?, event_name=? WHERE id=?',
      [title || existing.title, image_url || existing.image_url, event_name || existing.event_name, req.params.id]
    );
    res.json({ message: 'Gallery item updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/gallery/:id — Admin: delete gallery item
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Gallery item deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;