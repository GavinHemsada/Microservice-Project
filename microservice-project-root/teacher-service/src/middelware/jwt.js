const Teacher = require("../model/teacher");
const jwt = require('jsonwebtoken');

const protectJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });

      const user = await Teacher.findById(decoded.teacherId).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('JWT protect error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = protectJWT;
