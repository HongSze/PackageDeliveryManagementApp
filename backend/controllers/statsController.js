const firestoreService = require('../fireStore');

module.exports = {
  /**
   * Get statistics for CRUD operations.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  getStats: async function (req, res) {
    try {
      const counters = await firestoreService.getCounters();
      res.json(counters);
      // res.render('stats', { counters });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};