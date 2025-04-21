const express = require('express');
const cors = require('cors');
const db = require('./db');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow frontend URLs (both local and deployed)
const allowedOrigins = [
  'http://localhost:3000', // Local development URL
  'https://bulk-ordering-app-frontend.vercel.app/' // Deployed frontend URL
];

app.use(cors({
  origin: allowedOrigins,  // Allow only specified origins
  credentials: true, // Allow cookies (and credentials)
}));

// Middleware
app.use(express.json());  // Parse JSON data

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Backend Server is Running 🚀');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
