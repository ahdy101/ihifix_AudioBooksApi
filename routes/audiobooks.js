const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
  try {

    const query = 'SELECT * FROM audio_books';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const audioBookId = req.params.id;
  try {
    const query = 'SELECT * FROM audio_books WHERE id = $1';
    const { rows } = await pool.query(query, [audioBookId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Audio book not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const newAudioBook = req.body;
  try {
    const { title, author, description, duration, release_date, genre, rating, price, cover_image_url, audio_file_url } = newAudioBook;
    const query = 'INSERT INTO audio_books (title, author, description, duration, release_date, genre, rating, price, cover_image_url, audio_file_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    const { rows } = await pool.query(query, [title, author, description, duration, release_date, genre, rating, price, cover_image_url, audio_file_url]);
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
  router.delete('/:id', async (req, res) => {
    const audioBookId = req.params.id;
    try {
      const query = 'DELETE FROM audio_books WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [audioBookId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Audio book not found' });
      }
  
      res.json({ message: 'Audio book deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;
