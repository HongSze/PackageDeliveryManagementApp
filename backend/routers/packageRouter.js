const express = require('express');
const packageController = require('../controllers/packageController');
const router = express.Router();

/**
 * Route to get all packages.
 * @name GET /
 * @function
 * @memberof module:routers/packageRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/', packageController.getAll);

/**
 * Route to add a new package.
 * @name POST /add
 * @function
 * @memberof module:routers/packageRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/add', packageController.createOne);

/**
 * Route to update an existing package.
 * @name PUT /update
 * @function
 * @memberof module:routers/packageRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.put('/update', packageController.updateOne);

/**
 * Route to delete a package by ID.
 * @name DELETE /delete/:id
 * @function
 * @memberof module:routers/packageRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.delete('/delete/:id', packageController.deleteOne);

module.exports = router;