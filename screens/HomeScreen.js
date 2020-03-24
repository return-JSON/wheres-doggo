import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button
} from 'react-native';
<<<<<<< HEAD
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import { MonoText } from '../components/StyledText';
import { db } from '../config/firebase';

// const dogs = db.collection('dogs').doc('shiba');
// let getDog = dogs
//   .get()
//   .then(doc => {
//     if (!doc.exists) {
//       console.log('No such document!');
//     } else {
//       console.log('Document data:', doc.data());
//     }
//   })
//   .catch(err => {
//     console.log('Error getting document', err);
//   });
=======
import firebase from 'firebase'


>>>>>>> nauth

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Text>Welcome to DogGo!!!</Text>
      <Image 
        style={{width:300, height:250}}
        source={{uri:'https://i.barkpost.com/wp-content/uploads/2015/02/featmeme.jpg?q=70&fit=crop&crop=entropy&w=808&h=500'}} />
      <Button 
        title='Sign Out'
        onPress={() => firebase.auth().signOut()}/>
   
    </View>
  );
}



const styles = StyleSheet.create({
  container:{
      flex:1,
      alignItems:'center',
      justifyContent: 'center'
  }
})