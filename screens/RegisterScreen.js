import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import firebase from '../config/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage:null
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        console.log(user);
      }
    });
  }

  signUpUser = (email, password) => {
    try {
      if (this.state.password.length < 6) {
        alert('Please enter atleast 6 characters');
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error.toString());
    }
  };

  loginUser = () => {
      const {email, password} = this.state;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => this.setState({errorMessage:error.message}))
  };




  render() {
    return (
      <View style={styles.container}>

      <View style ={styles.errorMessage}>
        {this.state.errorMessage && <Text style ={styles.error}>{this.state.errorMessage}</Text>}
      </View>

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Email"
          placeholderTextColor="#9a73ef"
          autoCapitalize="none"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Password"
          placeholderTextColor="#9a73ef"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

  <TouchableOpacity style= {{alignSelf:"center", marginTop: 32}}>
    <Text style={{color:'#414959', fontSize:13}}>
      New to Where's DogGo? <Text style={{fontWeight:"500", color:"#E944GA"}}>Sign Up</Text>
    </Text>
  </TouchableOpacity>


        <Button
          title="Sign Up"
          onPress={() => this.signUpUser(this.state.email, this.state.password)}
        />



        <Button
          title="Log In"
          onPress={this.loginUser}
        />

      </View>
    );
  }
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    margin: 4,
    height: 40,
    width: 300,
    borderColor: '#7a42f4',
    borderWidth: 1
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40
  },
  errorMessage:{
    height:72,
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:30
  },
  error:{
    color:"green",
    fontSize:13,
    fontWeight:"600",
    textAlign:"center"
  }
});
