const express = require('express')
const cors = require('cors')
const db = require('./db')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:3000',
  'https://bulk-ordering-app-frontend.vercel.app',
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}))

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Backend Server is Running 🚀')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})



// const express = require('express');
// const cors = require('cors');
// const db = require('./db');
// const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');
// const authRoutes = require('./routes/auth');
// require('dotenv').config();

// const app = express();
// const port = 5000; // Backend will run on port 5000

// // Middleware
// app.use(cors()); // Allow cross-origin requests from the frontend
// app.use(express.json()); // Parse JSON data

// // Use routes
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/auth', authRoutes);

// // Root route for testing
// app.get('/', (req, res) => {
//   res.send('Backend Server is Running 🚀');
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

