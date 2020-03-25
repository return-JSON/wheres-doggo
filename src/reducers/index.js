import { combineReducers, createStore } from 'redux';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { firestoreReducer } from 'redux-firestore';
import camera from './camera';

export default combineReducers({
  firestore: firestoreReducer,
  camera
});
