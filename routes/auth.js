const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // PostgreSQL DB connection

const router = express.Router();
const JWT_SECRET = 'your_secret_key'; // Use env variable in production

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if user exists
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 3. Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Return token and user info
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
