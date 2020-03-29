import * as React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
// import { fetchUser } from '../src/reducers/user'; (reminder to delete user if needed)
import * as firebase from 'firebase';
import DogTile from '../components/DogTile';
import { dog } from '../constants/dog';
import { db } from '../config/firebase';

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

export default function HomeScreen(props) {
   const { initializing, user } = useAuth();
   const [error, setError] = React.useState(false);
   const [loading, setLoading] = React.useState(true);
   const [userId, setId] = React.useState('');
   const [userDogs, setUserDogs] = React.useState([]);
   const [allDogs, setAllDogs] = React.useState([]);
   /*
   // initialize our default state
   // when the id attribute changes (including mount)
   // subscribe to the recipe document and update
   // our state when it changes. */

   React.useEffect(() => {
      // dogs database (allDogs)
      const unsubscribe = db.collection('dogs').onSnapshot(
         snapshot => {
            const allDogsArr = [];
            snapshot.forEach(doc => {
               const {
                  breed,
                  description,
                  imageUrl,
                  lastSeen,
                  points
               } = doc.data();
               allDogsArr.push({
                  key: doc.id,
                  source: 'database',
                  breed,
                  description,
                  imageUrl,
                  lastSeen,
                  points
               });
            });
            setLoading(false);
            setAllDogs(allDogsArr);
         },
         err => {
            setError(err);
         }
      );
      return () => unsubscribe();
   }, [userId]);

   React.useEffect(() => {
      // userId
      const unsubscribe = db
         .collection('users')
         .where('email', '==', user.email)
         .onSnapshot(
            doc => {
               setId(doc.docs[0].id);
            },
            err => {
               setError(err);
            }
         );

      // returning the unsubscribe function will ensure that
      // we unsubscribe from document changes when our id
      // changes to a different value.
      return () => unsubscribe();
   }, [userId]);

   React.useEffect(() => {
      // user dogs (userDogs)
      if (userId) {
         const unsubscribe = db
            .collection('users')
            .doc(userId)
            .collection('dogs')
            .onSnapshot(
               snapshot => {
                  const dogsArr = [];
                  snapshot.forEach(doc => {
                     const { breed, imageUrl, location } = doc.data();
                     dogsArr.push({
                        key: doc.id,
                        source: 'user',
                        breed,
                        imageUrl,
                        location
                     });
                  });
                  setLoading(false);
                  setUserDogs(dogsArr);
               },
               err => {
                  setError(err);
               }
            );

         return () => unsubscribe();
      }
   }, [userId]);

   // const { email } = firebase.auth().currentUser;
   // const [email, setEmail] = React.useState(firebase.auth().currentUser.email);

   // grey out the uncaught dog photos
   // if style can be passed down as a variable?
   // overlay a view that is grey
   // merge into one array, removing dupes
   // order such that user dogs are first
   // render all dogs
   // can only click on dogs that have been caught

   const uniqueDogs = userDogs;
   allDogs.forEach(dog => {
         for (let i = 0; i < userDogs.length; i++) {
            if (dog.breed === userDogs[i].breed) {
               return;
            }
         }
         uniqueDogs.push(dog);
      });
  

   signOutUser = () => {
      firebase.auth().signOut();
   };
   if (initializing) {
      return <Text>Loading</Text>;
   }

   return (
      <ScrollView>
         <View style={styles.container}>
            <Text>Welcome to DogGo {user.displayName}!!!</Text>
            <Text>Doggos collected:</Text>
            <View style={styles.cardChild}>
               {uniqueDogs.map(dog => {
                  return <DogTile dog={dog} key={dog.key} />;
               })}
            </View>
            <Button title='Sign Out' onPress={signOutUser} />
         </View>
      </ScrollView>
   );
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
