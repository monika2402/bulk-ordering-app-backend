const express = require('express');
const router = express.Router();
const db = require('../db');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// POST to place an order
router.post('/', authenticateToken, async (req, res) => {
  const { buyer_name, buyer_contact, delivery_address, items } = req.body;
  const user_id = req.user.id; // Assuming the user is authenticated and user_id is available from the token

  try {
    const result = await db.query(
      `INSERT INTO orders (buyer_name, buyer_contact, delivery_address, items, user_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [buyer_name, buyer_contact, delivery_address, JSON.stringify(items), user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all orders (for admin or all users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);

    const enrichedOrders = result.rows.map(order => {
      // Safely parse items if needed
      const parsedItems =
        typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

      // No need to fetch product details as they are already in the items
      return {
        ...order,
        items: parsedItems,
      };
    });

    res.json(enrichedOrders);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// GET order details by order ID
router.get('/:id', authenticateToken, async (req, res) => {
  const orderId = req.params.id;

  try {
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT request to update order status by ID
router.put('/:id/status', authenticateToken, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order: result.rows[0] });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Optional: Validate that the order exists first
    const existingOrder = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (existingOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/orders/status/:status', async (req, res) => {
  const { status } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE status ILIKE $1 ORDER BY id DESC',
      [status]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
