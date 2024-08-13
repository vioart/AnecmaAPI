const admin = require('firebase-admin');
const serviceAccountFirebase = require('../JSON/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountFirebase)
});

const db = admin.firestore();
const auth = admin.auth();  // Add this line to get the Auth instance

module.exports = { db, auth };  // Export both db and auth
