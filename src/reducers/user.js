import { db } from '../../config/firebase';

let initialState = {};

// action constant
const GET_USER = 'GET_USER';

// action creators
export const getUser = user => {
   return {
      type: GET_USER,
      user
   };
};

// thunk creators
export const fetchUser = email => {
   return async dispatch => {
      db.collection('users')
         .where('email', '==', email)
         .get()
         .then(async querySnapshot => {
            await dispatch(
               getUser({
                  ...querySnapshot.docs[0].data(),
                  id: querySnapshot.docs[0].id
               })
            );
         });
   };
};

// sub-reducer
export default (state = initialState, action) => {
   switch (action.type) {
      case GET_USER:
         return action.user;
      default:
         return state;
   }
};
