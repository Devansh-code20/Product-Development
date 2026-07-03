const express = require('express');
const router = express.Router();
const { queryAll, queryOne, runQuery } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// GET /api/events
router.get('/', (req, res) => {
  try {
    const events = queryAll('SELECT * FROM events ORDER BY date DESC');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/events — Admin: add event
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, description, date, location, type, image_url } = req.body;
    if (!title || !description || !date || !location || !type) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!['upcoming', 'past'].includes(type)) {
      return res.status(400).json({ message: "Type must be 'upcoming' or 'past'." });
    }
    const result = runQuery(
      'INSERT INTO events (title, description, date, location, type, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date, location, type, image_url || '']
    );
    res.status(201).json({ message: 'Event added.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/events/:id — Admin: update event
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { title, description, date, location, type, image_url } = req.body;
    const existing = queryOne('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery(
      'UPDATE events SET title=?, description=?, date=?, location=?, type=?, image_url=? WHERE id=?',
      [title||existing.title, description||existing.description, date||existing.date, location||existing.location, type||existing.type, image_url||existing.image_url, req.params.id]
    );
    res.json({ message: 'Event updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/events/:id — Admin: delete event
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;