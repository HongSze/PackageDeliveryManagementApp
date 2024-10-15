const mongoose = require('mongoose');

/**
 * Package schema
 * @typedef {Object} Package
 * @property {String} package_id - Unique identifier for the package.
 * @property {String} package_name - Name of the package.
 * @property {String} package_description - Description of the package.
 * @property {String} package_status - Status of the package (e.g., 'pending', 'delivered').
 * @property {ObjectId} driver_id - ID of the driver assigned to the package.
 * @property {Date} package_createdAt - Date when the package was created.
 */
const packageSchema = new mongoose.Schema({
    package_id: {
        type: String,
        unique: true,
        default: function () {
            return this.generatePackageId();
        }
    },
    package_title: {
        type: String,
        required: true,
        validate: {
            validator: function (title) {
                return /^[A-Za-z0-9\s]{3,15}$/.test(title);
            },
            message: 'Package title is required and should be alphanumeric with length between 3 and 15 inclusive'
        }
    },
    package_weight: {
        type: Number,
        required: true,
        validate: {
            validator: function (weight) {
                return weight > 0;
            },
            message: 'Package weight should be a positive non-zero number'
        }
    },
    package_destination: {
        type: String,
        required: true,
        validate: {
            validator: function (destination) {
                return /^[A-Za-z0-9\s]{5,15}$/.test(destination);
            },
            message: 'Package destination should be alphanumeric with length between 5 and 15 inclusive'
        }
    },
    package_description: {
        type: String,
        validate: {
            validator: function (description) {
                return description.length <= 30;
            },
            message: 'Package description should be a string with length between 0 and 30 inclusive'
        }
    },
    isAllocated: {
        type: Boolean,
        required: true
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Generate a unique package ID.
 * @returns {String} The generated package ID.
 */
packageSchema.methods.generatePackageId = function () {
    const randomChars = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`; // Generates 2 random uppercase letters
    const randomDigits = Math.floor(100 + Math.random() * 900); // Generates a 3-digit number
    return `P${randomChars}-HT-${randomDigits}`;
};

module.exports = mongoose.model('Package', packageSchema);