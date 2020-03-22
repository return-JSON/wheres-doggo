// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase';
import * as c from './constants';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
const config = {
  apiKey: c.FIREBASE_API_KEY,
  authDomain: c.FIREBASE_AUTH_DOMAIN,
  databaseURL: c.FIREBASE_DATABASE_URL,
  projectId: c.FIREBASE_PROJECT_ID,
  storageBucket: c.FIREBASE_STORAGE_BUCKET,
  measurementId: c.FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(config);
export const db = firebase.firestore();
