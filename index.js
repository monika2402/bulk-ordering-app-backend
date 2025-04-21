const express = require('express');
const cors = require('cors');
const db = require('./db');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow Vercel frontend & local dev with credentials
const allowedOrigins = [
  'http://localhost:3000',
  'https://bulk-ordering-app-frontend.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allow cookies
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Backend Server is Running 🚀');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
