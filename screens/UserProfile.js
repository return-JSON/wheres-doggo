import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { db } from '../config/firebase';

export default class UserProfile extends React.Component {
   constructor() {
      super();
      // will need to replace user2 with logged-in user
      this.ref = db.collection('users').doc('user2');
      this.state = {
         isLoading: true,
         userProf: {}
         //  key: ''
      };
   }

   componentDidMount() {
      this.ref.get().then(doc => {
         if (doc.exists) {
            this.setState({
               userProf: doc.data(),
               //    key: doc.id,
               isLoading: false
            });
         } else {
            console.log('No such document!');
         }
      });
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
                        style={{ width: 200, height: 200 }}
                        source={{
                           uri: this.state.userProf.photourl
                        }}
                     />
                  </View>
                  <View>
                     <Text>Friends:</Text>
                     <Text>no friends yet!</Text>
                  </View>
               </View>
               <View>
                  <Text>Doggos collected:</Text>
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
        alignContent: 'center',
   },
   userCard: {
      backgroundColor: '#fff',
      width: '50%'
   },
   cardChild: {
      flexDirection: 'row',
      flexWrap: 'wrap'
   }
});
