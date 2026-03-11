const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Read Bearer token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided. Please use Bearer token in Authorization header'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.slice(7);

    // Verify JWT using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user to req.user
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    return res.status(401).json({
      error: 'Authentication failed'
    });
  }
};

const requireAdmin = (req, res, next) => {
  // Check req.user.role === 'ADMIN'
  if (!req.user) {
    return res.status(401).json({
      error: 'User not authenticated. Use protect middleware first'
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access denied. Admin role required'
    });
  }

  next();
};

module.exports = {
  protect,
  requireAdmin
};
