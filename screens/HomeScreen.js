import * as React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { connect } from 'react-redux';
// import { fetchUser } from '../src/reducers/user';
import * as firebase from 'firebase';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import DogTile from '../components/DogTile';
import { dog } from '../constants/dog';


export default function HomeScreen(props) {
      const { email } = firebase.auth().currentUser;
      useFirestoreConnect([
         {
            collection: 'users',
            where: [['email', '==', email]],
            storeAs: 'userLoggedIn'
         }
      ]);
      const user = useSelector(
         state => state.firestore.ordered['userLoggedIn'][0]
      );
      useFirestoreConnect([
         {
            collection: 'users',
            doc: user.id,
            subcollections: [{ collection: 'dogs' }],
            storeAs: 'dogsColl'
         }
      ]);
      console.log(user)
      const dogs = useSelector(state => state.firestore.ordered['dogsColl']);
      console.log(dogs)

   signOutUser = () => {
      firebase.auth().signOut();
   };

   return (
      <View style={styles.container}>
         <Text>Welcome to DogGo 
            {user.firstName}!!!
         </Text>
         <Text>Doggos collected:</Text>
         <View style={styles.cardChild}>
            {dogs.map(dog => {
               return <DogTile dog={dog} key={dog.id} />;
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

// for all users
//  useFirestoreConnect([
//     { collection: 'users' } // or 'todos'
//  ]);
// const users = useSelector(state => state.firestore.ordered.users);

// for single user
// useFirestoreConnect([ { collection: 'users', doc: 'Fy5lvEPjAnWlAeP4pfdEUcjvyRD3' } ]);
// const users = useSelector(state => state.firestore.ordered.users[0])
