const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /posts - List all posts
router.get('/', (req, res) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ posts: rows });
  });
});

// GET /posts/:id - Get a specific post
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Post not found' });
    res.json(row);
  });
});

// POST /posts - Create a new post
router.post('/', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const excerpt = content.substring(0, 100); // Simple excerpt logic
  db.run('INSERT INTO posts (title, content, excerpt) VALUES (?, ?, ?)', [title, content, excerpt], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// PUT /posts/:id - Update a post
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const excerpt = content.substring(0, 100);
  db.run('UPDATE posts SET title = ?, content = ?, excerpt = ? WHERE id = ?', [title, content, excerpt, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// DELETE /posts/:id - Delete a post
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
