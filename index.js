// const express = require('express');
// const cors = require('cors');
// const db = require('./db');
// const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');
// const authRoutes = require('./routes/auth');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// // ✅ Explicit CORS config for frontend origin
// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://bulk-ordering-app-frontend.vercel.app',
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// app.options('*', cors())
// app.use(express.json());

// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/auth', authRoutes);

// // Health check route
// app.get('/', (req, res) => {
//   res.send('Backend Server is Running 🚀');
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });



const express = require('express');
const cors = require('cors');
const db = require('./db');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const port = 5000;

// ✅ Safe CORS Setup
const allowedOrigins = [
  'http://localhost:3000',
  'https://bulk-ordering-app-frontend.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true // Optional: if you're using cookies or headers for auth
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend Server is Running 🚀');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
