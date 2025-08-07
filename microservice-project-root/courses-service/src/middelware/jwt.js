const jwt = require('jsonwebtoken');

const protectJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('JWT protect error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = protectJWT;
