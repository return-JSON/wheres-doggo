// actions
const TAKE_PHOTO = 'TAKE PHOTO';

//// action creator
const takePhoto = photo => {
  return {
    type: takePhoto,
    photo
  };
};

//thunk creator
export const saveAndSetPhoto = photo => {
  return async dispatch => {
    const { data } = await axios.get(`/api/robots/${id}`);
    dispatch(getOneRobot(data));
  };
};

export default (state = {}, action) => {
  switch (action.type) {
    case TAKE_PHOTO:
      return action.photo;
    default:
      return state;
  }
};
