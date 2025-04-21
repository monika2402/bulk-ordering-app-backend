// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, 'Moni@2402');
    req.user = decoded; // Storing decoded user info in request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
