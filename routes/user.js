const express = require('express');
const router = express.Router();
const pool = require('../db/db');

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

router.post('/users', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
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
router.delete('/users/:id', async (req, res) => {
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
