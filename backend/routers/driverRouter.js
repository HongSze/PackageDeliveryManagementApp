const express = require('express');
const driverController = require('../controllers/driverController');
const router = express.Router();

/**
 * Route to get all drivers.
 * @name GET /
 * @function
 * @memberof module:routers/driverRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/', driverController.getAll);

/**
 * Route to add a new driver.
 * @name POST /add
 * @function
 * @memberof module:routers/driverRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/add', driverController.createOne);

/**
 * Route to update an existing driver.
 * @name PUT /update
 * @function
 * @memberof module:routers/driverRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.put('/update', driverController.updateOne);

/**
 * Route to delete a driver by ID.
 * @name DELETE /delete/:id
 * @function
 * @memberof module:routers/driverRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.delete('/delete/:id', driverController.deleteOne);

module.exports = router;