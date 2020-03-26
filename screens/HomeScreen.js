import * as React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { connect } from 'react-redux'
import { fetchUser } from '../src/reducers/user'
import * as firebase from 'firebase';
<<<<<<< HEAD
import Dogs from '../components/Dogs'
import { db } from '../config/firebase';
=======
>>>>>>> 309cb251369f4fc3062d230999fe6c49cc491766

class HomeScreen extends React.Component {
   constructor(props) {
      super(props);
   }

   componentDidMount() {
      const { email } = firebase.auth().currentUser;
      this.props.fetchUser(email);
      // this.props.fetchCollectedDogs(this.state.user.id)
   }

   signOutUser = () => {
      firebase.auth().signOut();
   };

   render() {
      //  console.log('this.props', this.props);
      //  console.log('this.state', this.state);
     const user = this.props.user
      return (
         <View style={styles.container}>
<<<<<<< HEAD
            <Text>Welcome to DogGo!!! {user.firstName}</Text>
            {console.log('user', user)}
            <Dogs user={user} />
=======
            <Text>Welcome to DogGo, {user.firstName}!!!</Text>
>>>>>>> 309cb251369f4fc3062d230999fe6c49cc491766
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

const mapState = state => {
   return {
      user: state.user
   }
}

const mapDispatch = dispatch => ({
   fetchUser: email => dispatch(fetchUser(email))
})

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
   }
});

export default connect(mapState, mapDispatch)(HomeScreen)
