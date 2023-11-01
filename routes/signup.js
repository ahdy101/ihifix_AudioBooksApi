const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Password hashing error' });
    }

    try {
      const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
      const { rows } = await pool.query(query, [username, email, hashedPassword]);

      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

module.exports = router;
