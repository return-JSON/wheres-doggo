import * as React from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import * as firebase from 'firebase';
import DogTile from '../components/DogTile';

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
    const [dogs, setDogs] = React.useState([]);
    // initialize our default state
    // when the id attribute changes (including mount)
    // subscribe to the recipe document and update
    // our state when it changes.
    React.useEffect(() => {
       const unsubscribe = firebase
          .firestore()
          .collection('users')
          .where('email', '==', user.email)
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
       return () => unsubscribe();
    }, []);

    console.log(userId)
   //  const myId = 'Fy5lvEPjAnWlAeP4pfdEUcjvyRD3';
    React.useEffect(() => {
       if (userId) {
          const unsubscribe = firebase
             .firestore()
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
                         breed,
                         imageUrl,
                         location
                      });
                   });
                   setLoading(false);
                   setDogs(dogsArr);
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
   // console.log(email);

   signOutUser = () => {
      firebase.auth().signOut();
   };
   
   if (initializing) {
      return <Text>Loading</Text>;
   }
   


   return (
      <View style={styles.container}>
         <Text>
            Welcome to DogGo
            {user.firstName}!!!
         </Text>
         <Text>Doggos collected:</Text>
         <View style={styles.cardChild}>
               {dogs.map(dog => {
                  return <DogTile dog={dog} key={dog.key} />;
               })}
            </View>
         <Button title='Sign Out' onPress={signOutUser} />
      </View>
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