import { db } from '../../config/firebase';

let initialState = { user: {}, dogs: [] };

// action constant
const GET_USER = 'GET_USER';
const GET_COLLECTED_DOGS = 'GET_COLLECTED DOGS';

// action creators
export const getUser = user => {
   return {
      type: GET_USER,
      user
   };
};

export const getCollectedDogs = dogsArr => {
   return {
      type: GET_COLLECTED_DOGS,
      dogsArr
   };
};

// thunk creators
// export const fetchUser = email => {
//    return async dispatch => {
//       db.collection('users')
//          .where('email', '==', email)
//          .get()
//          .then(async querySnapshot => {
//             await dispatch(
//                getUser({
//                   ...querySnapshot.docs[0].data(),
//                   id: querySnapshot.docs[0].id
//                })
//             );
//          });
//    };
// };

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

export const fetchCollectedDogs = userId => {
   return async dispatch => {
      console.log('thunk in reducer file hit', userId);
      const dogsArr = [];
      db.collection('users')
         .doc(userId)
         .collection('dogs')
         .get()
         .then(async querySnapshot => {
            querySnapshot.forEach(doc => {
               const { breed, imageUrl, location } = doc.data();
               dogsArr.push({ key: doc.id, doc, breed, imageUrl, location });
            });
            console.log('dogsArr', dogsArr);
            await dispatch(getCollectedDogs(dogsArr));
         });
   };
};

// state
export default (state = initialState, action) => {
   switch (action.type) {
      case GET_USER:
         return { ...state, user: action.user };
      case GET_COLLECTED_DOGS:
         console.log('reducer hit', state);
         return { ...state, dogs: action.dogsArr };
      default:
         return state;
   }
};
