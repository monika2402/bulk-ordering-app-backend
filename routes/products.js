const express = require('express');
const router = express.Router();
const db = require('../db'); // assuming db.js handles connection to PostgreSQL
const authenticateToken = require('../middleware/authMiddleware');

// Helper function to build the WHERE clause dynamically
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, title_search, rating, sort_by } = req.query

    let query = 'SELECT * FROM products WHERE 1=1'
    const values = []
    let idx = 1

    if (title_search) {
      query += ` AND title ILIKE $${idx}`
      values.push(`%${title_search.trim()}%`)
      idx++
    }

    if (category) {
      query += ` AND category = $${idx}`
      values.push(category)
      idx++
    }

    if (rating) {
      query += ` AND rating >= $${idx}`
      values.push(parseInt(rating, 10))
      idx++
    }

    if (sort_by === 'PRICE_HIGH') {
      query += ' ORDER BY price DESC'
    } else if (sort_by === 'PRICE_LOW') {
      query += ' ORDER BY price ASC'
    }

    const result = await db.query(query, values)
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching products:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})


// POST a new product
router.post('/', authenticateToken, async (req, res) => {
  const { title, brand, description, image_url, price, rating, total_reviews, availability, category, quantity } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO products (title, brand, description, image_url, price, rating, total_reviews, availability, category, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [title, brand, description, image_url, price, rating, total_reviews, availability, category, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT request to update product by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params

  try {
    // 1️⃣ fetch the main product
    const prodResult = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [id],
    )
    if (prodResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    const product = prodResult.rows[0]

    // 2️⃣ fetch similar products (same category, exclude this id)
    const simResult = await db.query(
      'SELECT * FROM products WHERE category = $1 AND id <> $2 LIMIT 4',
      [product.category, id],
    )

    // 3️⃣ respond with product + similar_products array
    res.json({
      ...product,
      similar_products: simResult.rows,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// DELETE request to remove product by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, rating, image_url, total_reviews, availability, category, quantity } = req.body; // Ensure fields match frontend

  try {
    const result = await db.query(
      `UPDATE products 
       SET title = $1, description = $2, price = $3, rating = $4, image_url = $5,
           total_reviews = $6, availability = $7, category = $8, quantity = $9
       WHERE id = $10 RETURNING *`,
      [title, description, parseFloat(price), parseFloat(rating), image_url, total_reviews, availability, category, quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
