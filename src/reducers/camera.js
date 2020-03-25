// import { useFirebase } from 'react-redux-firebase';
// const firebase = useFirebase();
import submitToGoogle from '../googleVision';
//test objects
import { dog, notADog, breedList } from '../../constants/dog';
import { dogResponseComboFunction } from '../../constants/utilityFunctions';

let initialState = {
  uri: '',
  dogBreed: ''
};

// actions
const SET_PHOTO_URI = 'SET_PHOTO_URI';
const SET_DOG = 'SET_DOG';

//// action creator
export const takePhoto = uri => {
  return {
    type: SET_PHOTO_URI,
    uri
  };
};

export const setDogBreed = dogBreed => {
  return {
    type: SET_DOG,
    dogBreed
  };
};

//thunk creator
export const setPhotoUri = uri => {
  return async dispatch => {
    let response = await submitToGoogle();
    response = dogResponseComboFunction(response, breedList);
    await dispatch(takePhoto(uri));
    await dispatch(setDogBreed(response));
  };
};

export default (state = {}, action) => {
  switch (action.type) {
    case SET_PHOTO_URI:
      return { ...state, uri: action.uri };
    case SET_DOG:
      return { ...state, dogBreed: action.dogBreed };
    default:
      return state;
  }
};
