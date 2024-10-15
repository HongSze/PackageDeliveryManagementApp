const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key'; 

function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };