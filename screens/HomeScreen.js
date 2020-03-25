import * as React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import * as firebase from 'firebase'

export default class HomeScreen extends React.Component{
  state = {
    email:'',
    displayName:''
  }
  componentDidMount(){
    const {email,displayName} = firebase.auth().currentUser;
    this.setState({email, displayName})
  }

signOutUser = () => {
  firebase.auth().signOut();
}




  render(){
  return (
    <View style={styles.container}>
      <Text>Welcome to DogGo!!!   {this.state.email}</Text>
      <Image
        style={{ width: 300, height: 250 }}
        source={{
          uri:
            'https://i.barkpost.com/wp-content/uploads/2015/02/featmeme.jpg?q=70&fit=crop&crop=entropy&w=808&h=500'
        }}
      />
      <Button title="Sign Out" onPress={this.signOutUser} />
    </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
