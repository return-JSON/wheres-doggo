// import { useFirebase } from 'react-redux-firebase';
// const firebase = useFirebase();

let initialState = {
  uri: '',
  dogId: 'dog'
};

// actions
const SET_PHOTO_URI = 'SET_PHOTO_URI';
const SET_DOG = 'SET_DOG';

//// action creator
const takePhoto = photo => {
  return {
    type: SET_PHOTO_URI,
    uri
  };
};

//thunk creator
export const setPhotoUri = uri => {
  return dispatch => {
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
