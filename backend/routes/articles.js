const express = require('express');
const router = express.Router();
const { queryAll, queryOne, runQuery } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// GET /api/articles
router.get('/', (req, res) => {
  try {
    const articles = queryAll('SELECT id, title, excerpt, author, category, image_url, created_at FROM articles ORDER BY created_at DESC');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/articles/:id
router.get('/:id', (req, res) => {
  try {
    const article = queryOne('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/articles — Admin: add article
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, excerpt, content, author, category, image_url } = req.body;
    if (!title || !excerpt || !content || !author || !category) {
      return res.status(400).json({ message: 'Title, excerpt, content, author and category are required.' });
    }
    const result = runQuery(
      'INSERT INTO articles (title, excerpt, content, author, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, excerpt, content, author, category, image_url || '']
    );
    res.status(201).json({ message: 'Article added.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/articles/:id — Admin: update article
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { title, excerpt, content, author, category, image_url } = req.body;
    const existing = queryOne('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery(
      'UPDATE articles SET title=?, excerpt=?, content=?, author=?, category=?, image_url=? WHERE id=?',
      [title||existing.title, excerpt||existing.excerpt, content||existing.content, author||existing.author, category||existing.category, image_url||existing.image_url, req.params.id]
    );
    res.json({ message: 'Article updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/articles/:id — Admin: delete article
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Not found.' });
    runQuery('DELETE FROM articles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Article deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;