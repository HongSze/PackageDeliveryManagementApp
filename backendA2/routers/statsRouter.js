const express = require('express');
const statsController = require('../controllers/statsController');
const router = express.Router();

/**
 * Route to get statistics for CRUD operations.
 * @name GET /
 * @function
 * @memberof module:routers/statsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/', statsController.getStats);

module.exports = router;