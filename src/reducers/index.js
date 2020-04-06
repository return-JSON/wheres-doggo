import { combineReducers, createStore } from 'redux';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { firestoreReducer } from 'redux-firestore';
import camera from './camera';
import user from './user';
import dogs from './dog';

export default combineReducers({
  firestore: firestoreReducer,
  camera,
  user,
  dogs
});
