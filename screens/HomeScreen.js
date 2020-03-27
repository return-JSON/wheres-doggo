import * as React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { connect } from 'react-redux';
// import { fetchUser } from '../src/reducers/user';
import * as firebase from 'firebase';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import DogTile from '../components/DogTile';
import { dog } from '../constants/dog';
// import UserProfile from '../components/UserProfile'

const userContext = React.createContext({
   user: null
});

export const useSession = () => {
   const { user } = React.useContext(userContext);
   return user;
};

export const useAuth = () => {
   const [state, setState] = React.useState(() => {
      const user = firebase.auth().currentUser;
      return { initializing: !user, user };
   });
   function onChange(user) {
      setState({ initializing: false, user });
   }

   React.useEffect(() => {
      // listen for auth state changes
      const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
      // unsubscribe to the listener when unmounting
      return () => unsubscribe();
   }, []);

   return state;
};

function findUserId(email) {
  // initialize our default state
  const [error, setError] = React.useState(false) 
  const [loading, setLoading] = React.useState(true) 
  const [userId, setId] = React.useState(null)
  // when the id attribute changes (including mount)
  // subscribe to the recipe document and update
  // our state when it changes.
  React.useEffect(
    () => {
      const unsubscribe = firebase
         .firestore()
         .collection('users')
         .where('email', '==', email)
         .onSnapshot(
            doc => {
               // console.log('docs', docs);
               setLoading(false);
               setId(doc.docs[0].id);
            },
            err => {
               setError(err);
            }
         );

      // returning the unsubscribe function will ensure that
      // we unsubscribe from document changes when our id
      // changes to a different value.
      return () => unsubscribe()
    },
    [email]
  )

  return {
     error,
     loading,
     userId
  };
}

export default function HomeScreen(props) {
   // const { email } = firebase.auth().currentUser;


   // const [email, setEmail] = React.useState(firebase.auth().currentUser.email);
   // console.log(email);

   signOutUser = () => {
      firebase.auth().signOut();
   };
   const { initializing, user } = useAuth();
   if (initializing) {
      return <Text>Loading</Text>;
   }
   
   console.log('user', user.email)
   console.log(findUserId(user.email));
   return (
      <userContext.Provider value={{ user }}>
         <Text>
            Hello,
            {/* {user.displayName} */}
         </Text>
      </userContext.Provider>
      // <View style={styles.container}>
      //    <Text>
      //       Welcome to DogGo
      //       {/* {user.firstName}!!! */}
      //    </Text>
      //    <Text>Doggos collected:</Text>
      //    {/* <View style={styles.cardChild}>
      //          {dogs.map(dog => {
      //             return <DogTile dog={dog} key={dog.id} />;
      //          })}
      //       </View> */}
      //    <Button title='Sign Out' onPress={signOutUser} />
      // </View>
   );
   //    useFirestoreConnect([
   //       {
   //          collection: 'users',
   //          where: [['email', '==', email]],
   //          storeAs: 'userLoggedIn'
   //       }
   //    ]);
   //    const user = useSelector(
   //       state => {
   //          if (email) return state.firestore.ordered['userLoggedIn'][0]
   //       }
   //       // state => state.firestore.ordered['userLoggedIn'][0]
   //    );

   //    console.log(user, user.id);
   //    useFirestoreConnect([
   //       {
   //          collection: 'users',
   //          doc: user.id,
   //          subcollections: [{ collection: 'dogs' }],
   //          storeAs: 'dogsColl'
   //       }
   //    ]);
   //    const dogs = useSelector(state => {
   //       if (user && user.id) return state.firestore.ordered['dogsColl'];
   //    });
   //   console.log(dogs);

}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
   },
   cardChild: {
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap'
   }
});

// for all users
//  useFirestoreConnect([
//     { collection: 'users' } // or 'todos'
//  ]);
// const users = useSelector(state => state.firestore.ordered.users);

// for single user
// useFirestoreConnect([ { collection: 'users', doc: 'Fy5lvEPjAnWlAeP4pfdEUcjvyRD3' } ]);
// const users = useSelector(state => state.firestore.ordered.users[0])
