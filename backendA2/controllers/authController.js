const { createUser, findUserByUsername } = require('../fireStore');
const User = require('../models/user');

module.exports = {
   /**
   * Sign up a new user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  signup: async function (req, res) {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      await createUser(username, password); 
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Log in a user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */  
  login: async function (req, res) {
    const { username, password } = req.body;

    try {
      const user = await findUserByUsername(username);
      if (user && user.password === password) {
        req.session.user = user;
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};