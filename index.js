// index.js

const express = require('express');
const cors = require('cors');
const db = require('./db');
const productRoutes = require('./routes/products'); 
const orderRoutes = require('./routes/orders');  
const authRoutes = require('./routes/auth');  
require('dotenv').config();  

const app = express();
const port = 5000; // Backend will run on port 5000


// Middleware
app.use(cors()); // Allow cross-origin requests from the frontend
app.use(express.json()); // Parse JSON data

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.send('Backend Server is Running 🚀');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

