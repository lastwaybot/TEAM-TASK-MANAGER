const admin = require('firebase-admin');
require('dotenv').config();

let db = null;
let firebaseInitialized = false;

try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  db = admin.firestore();
  firebaseInitialized = true;
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.warn('⚠️  Firebase Admin initialization failed:', error.message);
  console.warn('   The server will start but API calls requiring Firebase will fail.');
  console.warn('   Please configure valid Firebase credentials in .env file.');
}

module.exports = { admin, db, firebaseInitialized };
