import * as React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import * as firebase from 'firebase';
import { db } from '../config/firebase';

export default class HomeScreen extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         email: '',
         displayName: '',
         user: {}
      };
   }
   componentDidMount() {
      const { email, displayName } = firebase.auth().currentUser;
      this.setState({ email, displayName });
      this.getUser(email);
   }

   getUser(email) { // to be refactored into reducer
      db.collection('users')
         .where('email', '==', email)
         .get()
         .then(querySnapshot => {
            this.setState({
              user: {
                ...querySnapshot.docs[0].data(),
                id: querySnapshot.docs[0].id
              }
            });
         });
   }

   signOutUser = () => {
      firebase.auth().signOut();
   };

   render() {
    //  console.log('state', this.state)
      return (
         <View style={styles.container}>
            <Text>Welcome to DogGo!!! {this.state.email}</Text>
            <Image
               style={{ width: 300, height: 250 }}
               source={{
                  uri:
                     'https://i.barkpost.com/wp-content/uploads/2015/02/featmeme.jpg?q=70&fit=crop&crop=entropy&w=808&h=500'
               }}
            />
            <Button title='Sign Out' onPress={this.signOutUser} />
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
   }
});
