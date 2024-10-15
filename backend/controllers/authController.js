const { createUser, findUserByUsername } = require('../fireStore');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');


module.exports = {
   /**
   * Sign up a new user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
   signup: async function (req, res) {
    const { username, password, confirmPassword } = req.body;
    console.log('Signup request received:', { username, password, confirmPassword });
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log('Username already exists');
        return res.status(400).json({ error: 'Username already exists' });
      }
      await createUser(username, password);
      console.log('User created successfully');
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Log in a user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */  
  login: async (req, res) => {
    console.log('Login controller hit');
    const { username, password } = req.body;
    console.log('Username:', username);
    console.log('Password:', password);

    try {
      const user = await findUserByUsername(username);
      console.log('User found:', user);

      if (user && user.password === password) {
        const token = generateToken(user);
        console.log('Login successful, token generated:', token);
        res.json({ token });
      } else {
        console.error('Invalid username or password');
        res.status(401).send('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal server error');
    }
  }
};