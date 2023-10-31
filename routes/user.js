const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/', async (req, res) => {
  const newUser = req.body;
  try {
    const { username, email, password } = newUser;
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [username, email, password]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.patch('/:id', async (req, res) => {
    const audioBookId = req.params.id;
    const updatedAudioBook = req.body;
    try {
      const { title, author, description, duration, release_date, genre, rating, price, cover_image_url, audio_file_url } = updatedAudioBook;
      const query = 'UPDATE audio_books SET title = $1, author = $2, description = $3, duration = $4, release_date = $5, genre = $6, rating = $7, price = $8, cover_image_url = $9, audio_file_url = $10 WHERE id = $11 RETURNING *';
      const { rows } = await pool.query(query, [title, author, description, duration, release_date, genre, rating, price, cover_image_url, audio_file_url, audioBookId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Audio book not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch('/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    try {
      const { username, email, password } = updatedUser;
      const query = 'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *';
      const { rows } = await pool.query(query, [username, email, password, userId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [userId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;
