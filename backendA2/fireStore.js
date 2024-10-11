const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const countersRef = db.collection('counters').doc('crudOperations');
const usersRef = db.collection('users');

/**
 * Increment a counter for a specific operation.
 * @param {string} operation - The operation to increment the counter for (e.g., 'insert', 'retrieve', 'update', 'delete').
 */
async function incrementCounter(operation) {
  try {
    const increment = admin.firestore.FieldValue.increment(1);
    await countersRef.update({ [operation]: increment });
  } catch (error) {
    console.error('Error incrementing counter:', error);
  }
}

/**
 * Get the current counters for CRUD operations.
 * @returns {Promise<Object>} The current counters for CRUD operations.
 */
async function getCounters() {
  try {
    const doc = await countersRef.get();
    if (!doc.exists) {
      return {
        insert: 0,
        retrieve: 0,
        update: 0,
        delete: 0
      };
    } else {
      return doc.data();
    }
  } catch (error) {
    console.error('Error getting counters:', error);
    return {
      insert: 0,
      retrieve: 0,
      update: 0,
      delete: 0
    };
  }
}

/**
 * Create a new user in Firestore.
 * @param {string} username - The username of the new user.
 * @param {string} password - The password of the new user.
 * @throws Will throw an error if the username already exists or if there is an error creating the user.
 */
async function createUser(username, password) {
  try {
    const userRef = usersRef.where('username', '==', username);
    const snapshot = await userRef.get();
    if (!snapshot.empty) {
      throw new Error('Username already exists');
    }
    await usersRef.add({ username, password });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Find a user by username in Firestore.
 * @param {string} username - The username to search for.
 * @returns {Promise<Object|null>} The user data if found, otherwise null.
 * @throws Will throw an error if there is an error finding the user.
 */
async function findUserByUsername(username) {
  try {
    const userRef = usersRef.where('username', '==', username);
    const snapshot = await userRef.get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].data();
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

module.exports = {
  incrementCounter,
  getCounters,
  createUser,
  findUserByUsername
};