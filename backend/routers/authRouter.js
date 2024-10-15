const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Route to sign up a new user.
 * @name POST /signup
 * @function
 * @memberof module:routers/authRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/signup', (req, res, next) => {
  console.log('Signup route hit');
  console.log('Request body:', req.body);
  authController.signup(req, res, next);
});

/**
 * Route to log in a user.
 * @name POST /login
 * @function
 * @memberof module:routers/authRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/login', (req, res, next) => {
    console.log('Login route hit');
    console.log('Request body:', req.body);
    authController.login(req, res, next);
  });
  
module.exports = router;
