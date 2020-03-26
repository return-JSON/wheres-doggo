import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import DogTile from '../components/DogTile';
import { db } from '../config/firebase';
// note user1 is still hardcoded! will need to refactor to logged in user

export default class UserProfile extends React.Component {
   constructor() {
      super();
      // will need to replace user2 with logged-in user
      this.ref = db.collection('users').doc('user1');
      this.dogsRef = this.ref.collection('dogs');
      this.state = {
         isLoading: true,
         userProf: {},
         dogsArr: []
      };
      this.getDogSubcollection = this.getDogSubcollection.bind(this);
   }

   componentDidMount() {
      this.ref.get().then(doc => {
         if (doc.exists) {
            this.setState({
               userProf: doc.data(),
               isLoading: false
            });
         } else {
            console.log('No such document!');
         }
      });
      this.dogsRef
         .get()
         .then(querySnapshot => this.getDogSubcollection(querySnapshot));
   }

   getDogSubcollection(querySnapshot) {
      const dogsArr = [];
      querySnapshot.forEach(doc => {
         const { breed, imageUrl, location } = doc.data();
         dogsArr.push({ key: doc.id, doc, breed, imageUrl, location });
      });
      this.setState({ dogsArr });
   }

   render() {
      if (this.state.isLoading) {
         return (
            <View style={styles.preloader}>
               <Text>loading..</Text>
            </View>
         );
      }
      console.log('state', this.state);
      return (
         <View style={styles.container}>
            <View style={styles.userCard}>
               <View>
                  <Text>{this.state.userProf.name}</Text>
               </View>
               <View style={styles.cardChild}>
                  <View>
                     <Image
                        style={styles.profilePic}
                        source={{
                           uri: this.state.userProf.photourl
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
                  {this.state.dogsArr.map(dog => (
                     <DogTile dog={dog} key={dog.key} />
                  ))}
               </View>
            </View>
         </View>
      );
   }
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
      width: '50%'
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
