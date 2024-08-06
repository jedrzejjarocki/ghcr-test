const jwt = require('jsonwebtoken');
const {AUTH} = require('../config')
const {logger} = require("../logging");

const validateToken = (req, res, next) => {
  if(AUTH.IS_DISABLED.toUpperCase() === 'YES') {
    logger.warn('JWT auth check disabled, skipping')
    return next();
  }
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1]; // Extract token from header
    jwt.verify(bearerToken, AUTH.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      const {TOKEN_EXPIRATION_TIME} = AUTH;
      const currentTime = new Date().getTime();
      const expirationTime = new Date(decoded.iat * 1000 + TOKEN_EXPIRATION_TIME * 1000).getTime();
      const isExpired = currentTime > expirationTime;
      if(isExpired) {
        return res.status(403).json({ message: 'Token expired' });
      }
      next(); // Call next middleware
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = validateToken;
