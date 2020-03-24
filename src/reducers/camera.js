// import { useFirebase } from 'react-redux-firebase';
// const firebase = useFirebase();
import { submitToGoogle } from '../googleVision';

let initialState = {
  uri: '',
  googleResp: null,
  dogId: ''
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

//thunk creator
export const setPhotoUri = uri => {
  return async dispatch => {
    const { data } = await submitToGoogle();
    dispatch(takePhoto(uri));
  };
};

export default (state = {}, action) => {
  switch (action.type) {
    case SET_PHOTO_URI:
      return { ...state, uri: action.uri };
    case SET_DOG:
      return { ...state, dogId: action.dogId };
    default:
      return state;
  }
};
