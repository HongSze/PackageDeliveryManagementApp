const mongoose = require('mongoose');

/**
 * User schema
 * @typedef {Object} User
 * @property {String} username - Username of the user.
 * @property {String} password - Password of the user.
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (username) {
        return /^[A-Za-z0-9]{6,}$/.test(username);
      },
      message: 'Username must be at least 6 alphanumeric characters'
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        return password.length >= 5 && password.length <= 10;
      },
      message: 'Password must be between 5 and 10 characters'
    }
  }
});

module.exports = mongoose.model('User', userSchema);