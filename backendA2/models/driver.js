const mongoose = require('mongoose');

/**
 * Drive schema
 * @typedef {Object} Driver
 * @property {String} driver_id - Unique identifier for the driver.
 * @property {String} driver_name - Name of the driver.
 * @property {String} driver_department - Department of the driver (food, furniture, electronic).
 * @property {String} driver_licence - Licence of the driver.
 * @property {Boolean} driver_isActive - Whether the driver is active.
 * @property {Date} driver_createdAt - Date when the driver was created.
 * @property {Array<ObjectId>} assigned_packages - List of package IDs assigned to the driver.
 */
const driverSchema = new mongoose.Schema({
    driver_id: {
        type: String,
        unique: true,
        default: function () {
            return this.generateDriverId();
        }
    },
    driver_name: {
        type: String,
        required: true,
        validate: {
            validator: function (name) {
                return /^[A-Za-z\s]{3,20}$/.test(name);
            },
            message: 'Driver name is required and should be alphabetic with length between 3 and 20 inclusive'
        }
    },
    driver_department: {
        type: String,
        required: true,
        enum: ['food', 'furniture', 'electronic','Food','Furniture','Electronic'],
        message: 'Driver department is required and should be either food, furniture, or electronic'
    },
    driver_licence: {
        type: String,
        required: true,
        validate: {
            validator: function (licence) {
                return /^[A-Za-z0-9]{5}$/.test(licence);
            },
            message: 'Driver licence is required and should be alphanumeric with length 5'
        }
    },
    driver_isActive: {
        type: Boolean,
        required: true
    },
    driver_createdAt: {
        type: Date,
        default: Date.now
    },
    assigned_packages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Package'
    }]
});

/**
 * Generate a unique driver ID.
 * @returns {String} The generated driver ID.
 */
driverSchema.methods.generateDriverId = function () {
    const randomDigits1 = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Generates a 2-digit number
    const randomLetters = Array.from({ length: 3 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join(''); // Generates 3 random letters
    return `D${randomDigits1}-33-${randomLetters}`;
};

module.exports = mongoose.model('Driver', driverSchema);