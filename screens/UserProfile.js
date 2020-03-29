import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import DogTile from '../components/DogTile';
import { db } from '../config/firebase';
import * as firebase from 'firebase';
import { useAuth } from './HomeScreen';
// note user1 is still hardcoded! will need to refactor to logged in user

export default function UserProfile(props) {
   const { initializing, user } = useAuth();
   const [error, setError] = React.useState(false);
   const [loading, setLoading] = React.useState(true);
   const [userId, setId] = React.useState('');
   const [userProf, setProf] = React.useState({})
   const [userDogs, setUserDogs] = React.useState([]);

   React.useEffect(() => {
      const unsubscribe = db
         .collection('users')
         .where('email', '==', user.email)
         .onSnapshot(
            doc => {
               setId(doc.docs[0].id);
               setProf(doc.docs[0].data())
            },
            err => {
               setError(err);
            }
         );
      return () => unsubscribe();
   }, [userId]);

   React.useEffect(() => {
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

   if (initializing) {
      return <Text>Loading</Text>;
   }
   return (
      <View style={styles.container}>
         <View style={styles.userCard}>
            <View>
               <Text>{userProf.firstName}</Text>
            </View>
            <View style={styles.cardChild}>
               <View>
                  <Image
                     style={styles.profilePic}
                     source={{
                        uri: userProf.profilePicture
                     }}
                  />
               </View>
               {/* <View>
                     <Text>Friends:</Text>
                     <Text>no friends yet!</Text>
                  </View> */}
            </View>
            <View>
               <Text>Doggos collected:</Text>
            </View>
            <View style={styles.cardChild}>
               {userDogs.map(dog => (
                  <DogTile dog={dog} key={dog.key} />
               ))}
            </View>
         </View>
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
   userCard: {
      backgroundColor: '#fff',
      width: '75%'
   },
   cardChild: {
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap'
   },
   profilePic: {
      width: 175,
      height: 175
   }
});
