// import { useFirebase } from 'react-redux-firebase';
// const firebase = useFirebase();
import submitToGoogle from '../googleVision';

let initialState = {
  uri: '',
  googleResp: null,
  dogId: ''
};

// actions
const SET_PHOTO_URI = 'SET_PHOTO_URI';
const SET_GOOGLE_RESPONSE = 'SET_GOOGLE_RESPONSE';
const SET_DOG = 'SET_DOG';

//// action creator
export const takePhoto = uri => {
  return {
    type: SET_PHOTO_URI,
    uri
  };
};

export const setGoogle = reponse => {
  return {
    type: SET_GOOGLE_RESPONSE,
    response
  };
};

//thunk creator
export const setPhotoUri = uri => {
  return async dispatch => {
    let response = await submitToGoogle();
    await dispatch(takePhoto(uri));
    await dispatch(setGoogle(response));
  };
};

export default (state = {}, action) => {
  switch (action.type) {
    case SET_PHOTO_URI:
      return { ...state, uri: action.uri };
    case SET_DOG:
      return { ...state, dogId: action.dogId };
    case SET_GOOGLE_RESPONSE:
      return { ...state, googleResp: action.response };
    default:
      return state;
  }
};
