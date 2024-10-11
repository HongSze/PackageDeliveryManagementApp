const Driver = require('../models/driver');
const Package = require('../models/package');
const firestoreService = require('../fireStore'); 

module.exports = {
    /**
   * Get all drivers.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
    getAll: async function (req, res) {
        try {
            let drivers = await Driver.find().populate('assigned_packages');
            res.json(drivers);
            try {
                await firestoreService.incrementCounter('retrieve');
            } catch (firestoreError) {
                console.error('Firestore counter error: ', firestoreError);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /**
   * Create a new driver.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
    createOne: async function (req, res) {
        try {
            let newDriverDetails = req.body;
            let driver = new Driver(newDriverDetails);
            driver.driver_id = driver.generateDriverId(); 
            await driver.save();
            res.json({ id: driver._id, driver_id: driver.driver_id });
            try {
                await firestoreService.incrementCounter('insert');
            } catch (firestoreError) {
                console.error('Firestore counter error: ', firestoreError);
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                if (req.headers['content-type'] === 'application/json') {
                    res.status(400).json({ error: error.message });
                } else {
                    res.redirect('/33934479/HongSze/invalidData');
                }
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    },

    /**
   * Update an existing driver.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
    updateOne: async function (req, res) {
        try {
            let { id, driver_licence, driver_department } = req.body;
            let result = await Driver.findOneAndUpdate(
                { _id: id },
                { driver_licence, driver_department },
                { new: true, runValidators: true }
            );
            if (result) {
                res.json({ status: 'Driver updated successfully' });
                try {
                    await firestoreService.incrementCounter('update');
                } catch (firestoreError) {
                    console.error('Firestore counter error: ', firestoreError);
                }
            } else {
                res.status(404).json({ error: 'Driver ID not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /**
   * Delete a driver by ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
    deleteOne: async function (req, res) {
        try {
            const driverId = req.params.id;

            // Find the driver by ID
            const driver = await Driver.findById(driverId);
            if (!driver) {
                return res.status(404).json({ message: 'Driver not found' });
            }

            // Delete assigned packages
            await Package.deleteMany({ _id: { $in: driver.assigned_packages } });

            // Delete the driver
            await Driver.findByIdAndDelete(driverId);

            // Increment the delete counter
            await firestoreService.incrementCounter('delete');

            res.status(200).json({ message: 'Driver and assigned packages deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};
