import {
  submitToGoogle,
  getLocation,
  uploadImage,
  addPup,
  getBreedList,
} from '../api';
import { googleResponseProcessor } from '../../constants/utilityFunctions';

//test objects
import { dog, notADog, breedList } from '../../constants/dog';

let initialState = {
  imageUrl: '',
  breed: '',
  location: '',
};

// actions
const SET_PHOTO_URI = 'SET_PHOTO_URI';
const SET_DOG = 'SET_DOG';
const SET_LOCATION = 'SET_LOCATION';
const CLEAR_DOG = 'CLEAR_DOG';

//// action creator
const takePhoto = (imageUrl) => {
  return {
    type: SET_PHOTO_URI,
    imageUrl,
  };
};

const setLocation = (location) => {
  return {
    type: SET_LOCATION,
    location,
  };
};

const setDogBreed = (breed) => {
  return {
    type: SET_DOG,
    breed,
  };
};

export const clearDog = () => {
  return {
    type: CLEAR_DOG,
    clearState: {},
  };
};

//thunk creator
export const setPhotoUri = (photo) => {
  return async (dispatch) => {
    let response = await submitToGoogle(photo.base64);

    let newBreedList = await getBreedList();
    if (response === 'error' || newBreedList === 'error') {
      await dispatch(takePhoto('error'));
      await dispatch(setDogBreed('error'));
      return;
    }
    response = await googleResponseProcessor(response, newBreedList);
    let location = await getLocation();
    await dispatch(takePhoto(photo.uri));
    await dispatch(setDogBreed(response));
    await dispatch(setLocation(location));
  };
};

export const addPupThunk = (userId, stateObj) => {
  return async (dispatch) => {
    await uploadImage(userId, stateObj.imageUrl, stateObj.breed);
    await addPup(userId, stateObj);
    await dispatch(clearDog());
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
    case CLEAR_DOG:
      return action.clearState;
    default:
      return state;
  }
};
