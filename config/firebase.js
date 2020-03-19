import * as firebase from 'firebase';
import * as c from './constants';

// Initialize Firebase
const config = {
  apiKey: c.FIREBASE_API_KEY,
  authDomain: c.FIREBASE_AUTH_DOMAIN,
  databaseURL: c.FIREBASE_DATABASE_URL,
  projectId: c.FIREBASE_PROJECT_ID,
  storageBucket: c.FIREBASE_STORAGE_BUCKET
};

firebase.initializeApp(config);

const dbh = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
