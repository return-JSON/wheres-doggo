import { db } from "../../config/firebase";

let initialState = [];

// action constant
const GET_DOGS = "GET_DOGS";

// action creators
export const getDogs = dogs => {
  return {
    type: GET_DOGS,
    dogs
  };
};

// thunk creators
export const fetchDogs = () => {
  let dogsArr = [];
  return async dispatch => {
    let dogs = await db.collection("dogs").get()
    for (let dog of dogs.docs) {
      const id = dog.id
      const { breed, description, imageUrl, lastSeen, points } = dog.data()
      dogsArr.push({ key: id, breed, description, imageUrl, lastSeen, points })
    }
    await dispatch(getDogs(dogsArr))
  };
};

// sub-reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DOGS:
      return action.dogs;
    default:
      return state;
  }
};
