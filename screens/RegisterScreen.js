import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity
} from 'react-native';
import firebase from '../config/firebase';
import * as Animatable from 'react-native-animatable';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      errorMessage: null
    };
  }

  signUpUser = () => {
    const { email, password, firstName, lastName } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(results) {
        if (results.additionalUserInfo.isNewUser) {
          firebase
            .firestore()
            .collection('users')
            .doc(results.user.uid)
            .set({
              uid: results.user.uid,
              firstName: firstName,
              lastName: lastName,
              email: results.user.email,
              points: 0,
              createdAt: Date.now()
            });
        } else {
          firebase
            .firestore()
            .collection('users')
            .doc(result.user.uid)
            .update({
              lastLoggedIn: Date.now()
            });
        }
      })
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ ...styles.text, ...styles.header }}>{`Sign up \nto get started!`}</Text>



        <Animatable.View
          style={styles.footer}
          animation="fadeInUpBig"
          duration={1500}
        >
          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>

          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            placeholder="First Name"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
          />

          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            placeholder="Last Name"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={lastName => this.setState({ lastName })}
            value={this.state.lastName}
          />

          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            placeholder="Email"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />

          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            placeholder="Password"
            placeholderTextColor="black"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />

          <TouchableOpacity style={styles.button} onPress={this.signUpUser}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={() => this.props.navigation.navigate('LoginScreen')}>
            <Text style={{ fontSize: 16 }}>
              Already Have An Account?<Text style={{ fontWeight: "500", color: "blue" }}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  }
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D3E9FF'
  },
  text: {
    fontSize: 40,
    marginTop: 90
  },
  input: {
    margin: 2,
    height: 40,
    width: 0,
    backgroundColor: '#F2F9F8',
    borderWidth: 1,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30
  },
  error: {
    color: 'green',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center'
  },
  footer: {
    flex: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 2,
    paddingHorizontal: 80
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    marginHorizontal: 0,
    paddingLeft: 10,
    marginVertical: 5,
    borderColor: 'rgba(0,0,0,0.2)'
  },
  button: {
    backgroundColor: '#FFE066',
    height: 50,
    marginHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2
  }
});
