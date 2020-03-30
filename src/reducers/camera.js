import { submitToGoogle, getLocation, uploadImage, addPup } from '../api';
import { dogResponseComboFunction } from '../../constants/utilityFunctions';

//test objects
import { dog, notADog, breedList } from '../../constants/dog';

let initialState = {
  imageUrl: '',
  breed: '',
  location: ''
};

// actions
const SET_PHOTO_URI = 'SET_PHOTO_URI';
const SET_DOG = 'SET_DOG';
const SET_LOCATION = 'SET_LOCATION';
const ADD_DOG = 'ADD_DOG';

//// action creator
const takePhoto = imageUrl => {
  return {
    type: SET_PHOTO_URI,
    imageUrl
  };
};

const setLocation = location => {
  return {
    type: SET_LOCATION,
    location
  };
};

const setDogBreed = breed => {
  return {
    type: SET_DOG,
    breed
  };
};

const addDog = () => {
  return {
    type: ADD_DOG,
    clearState: {}
  };
};

//thunk creator
export const setPhotoUri = uri => {
  return async dispatch => {
    let response = await submitToGoogle(uri);

    response = await dogResponseComboFunction(response, breedList);
    let location = await getLocation();
    await dispatch(takePhoto(uri));
    await dispatch(setDogBreed(response));
    await dispatch(setLocation(location));
  };
};

export const addPupThunk = (userId, stateObj) => {
  return async dispatch => {
    await uploadImage(userId, stateObj.imageUrl, stateObj.breed);
    await addPup(userId, stateObj);
    await dispatch(addDog());
  };
};

export default (state = {}, action) => {
  switch (action.type) {
    case SET_PHOTO_URI:
      return { ...state, imageUrl: action.imageUrl };
    case SET_DOG:
      return { ...state, breed: action.breed };
    case SET_LOCATION:
      return { ...state, location: action.location };
    case ADD_DOG:
      return action.clearState;
    default:
      return state;
  }
};
