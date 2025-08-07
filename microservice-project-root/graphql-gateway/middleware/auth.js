const jwt = require('jsonwebtoken');

const authenticate = (token) => {

  if (token == null) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null; 
  }
};

module.exports = authenticate;
