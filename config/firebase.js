// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
<<<<<<< HEAD
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';
=======
import * as firebase from 'firebase';
import * as c from './constants';
>>>>>>> userProfile

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
const config = {
<<<<<<< HEAD
  apiKey: 'AIzaSyA8hlReGWY3w_soGYxSh5GektKkKz_QA08',
  authDomain: 'wheres-doggo.firebaseapp.com',
  databaseURL: 'https://wheres-doggo.firebaseio.com',
  projectId: 'wheres-doggo',
  storageBucket: 'wheres-doggo.appspot.com',
  messagingSenderId: '151112267540',
  appId: '1:151112267540:web:1d382d82045e3069113401',
  measurementId: 'G-Q8PSK511Q0'
=======
  apiKey: c.FIREBASE_API_KEY,
  authDomain: c.FIREBASE_AUTH_DOMAIN,
  databaseURL: c.FIREBASE_DATABASE_URL,
  projectId: c.FIREBASE_PROJECT_ID,
  storageBucket: c.FIREBASE_STORAGE_BUCKET,
  measurementId: c.FIREBASE_MEASUREMENT_ID
>>>>>>> userProfile
};

firebase.initializeApp(config);
export const db = firebase.firestore();
