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
router.post('/signup', authController.signup);

/**
 * Route to log in a user.
 * @name POST /login
 * @function
 * @memberof module:routers/authRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/login', authController.login);

module.exports = router;
