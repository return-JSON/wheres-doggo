// import { useFirebase } from 'react-redux-firebase';
// const firebase = useFirebase();
import { submitToGoogle, getLocation } from '../api';
//test objects
import { dog, notADog, breedList } from '../../constants/dog';
import { dogResponseComboFunction } from '../../constants/utilityFunctions';

let initialState = {
  uri: '',
  dogBreed: '',
  location: ''
};

// actions
const SET_PHOTO_URI = 'SET_PHOTO_URI';
const SET_DOG = 'SET_DOG';
const SET_LOCATION = 'SET_LOCATION';

//// action creator
const takePhoto = uri => {
  return {
    type: SET_PHOTO_URI,
    uri
  };
};

const setLocation = location => {
  return {
    type: SET_LOCATION,
    location
  };
};

const setDogBreed = dogBreed => {
  return {
    type: SET_DOG,
    dogBreed
  };
};

//thunk creator
export const setPhotoUri = uri => {
  return async dispatch => {
    let response = await submitToGoogle();
    response = await dogResponseComboFunction(response, breedList);
    let location = await getLocation();
    await dispatch(takePhoto(uri));
    await dispatch(setDogBreed(response));
    await dispatch(setLocation(location));
  };
};

export default (state = {}, action) => {
  switch (action.type) {
    case SET_PHOTO_URI:
      return { ...state, uri: action.uri };
    case SET_DOG:
      return { ...state, dogBreed: action.dogBreed };
    case SET_LOCATION:
      return { ...state, location: action.location };
    default:
      return state;
  }
};
