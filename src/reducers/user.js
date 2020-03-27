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

export const fetchUser = email => {
   let userObj, userId;
   return async dispatch => {
      const userDoc = await db
         .collection('users')
         .where('email', '==', email)
         .get();
      userObj = userDoc[0].data;
      userId = userDoc[0].data;
      //  .then(querySnapshot => {
      //     userObj = querySnapshot.docs[0].data()
      //     userId = querySnapshot.docs[0].id
      //  });
      console.log(userObj, userId);
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
