const Package = require('../models/package');
const Driver = require('../models/driver');
const firestoreService = require('../fireStore');  

module.exports = {
    /**
   * Get all packages.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */ 
    getAll: async function (req, res) {
        try {
            let packages = await Package.find();
            res.json(packages);
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
   * Create a new package.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
    createOne: async function (req, res) {
        try {
            let newPackageDetails = req.body;
            let driver = await Driver.findById(newPackageDetails.driver_id);
            // if (!driver) {
            //     return res.redirect('/33934479/HongSze/invalidData');
            // }
            let pkg = new Package(newPackageDetails);
            pkg.package_id = pkg.generatePackageId();
            await pkg.save();
    
            driver.assigned_packages.push(pkg._id);
            await driver.save();
    
            res.json({ id: pkg._id, package_id: pkg.package_id });
            try {
                await firestoreService.incrementCounter('insert');
            } catch (firestoreError) {
                console.error('Firestore counter error: ', firestoreError);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    /**
   * Update an existing package.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
    updateOne: async function (req, res) {
        try {
            let { id, package_destination } = req.body;
            let result = await Package.findOneAndUpdate(
                { _id: id }, 
                { package_destination }, 
                { new: true, runValidators: true }
            );
            if (result) {
                res.json({ status: 'Package updated successfully' });
                try {
                    await firestoreService.incrementCounter('update');
                } catch (firestoreError) {
                    console.error('Firestore counter error: ', firestoreError);
                }
            } else {
                res.status(404).json({ error: 'Package ID not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /**
   * Delete a package by ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
    deleteOne: async function (req, res) {
        try {
            let pkg = await Package.findByIdAndDelete(req.params.id);
            if (pkg) {
                await Driver.updateMany(
                    { assigned_packages: pkg._id },
                    { $pull: { assigned_packages: pkg._id } }
                );
                res.json({ acknowledged: true, deletedCount: 1 });
                try {
                    await firestoreService.incrementCounter('delete');
                } catch (firestoreError) {
                    console.error('Firestore counter error: ', firestoreError);
                }
            } else {
                res.status(404).json({ error: 'Package not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
