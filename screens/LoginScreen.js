import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from '../config/firebase';


class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: null
    };
  }


  loginUser = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => this.setState({ errorMessage: error.message }))
  };





  //GOOGLE SIGN IN
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );

          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function (result) {
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .firestore()
                  .collection('users')
                  .doc(result.user.uid)
                  .set({
                    email: result.user.email,
                    profilePicture:
                      result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    firstName: result.additionalUserInfo.profile.given_name,
                    lastName: result.additionalUserInfo.profile.family_name,
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
            .catch(function (error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              var email = error.email;
              var credential = error.credential;
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        iosClientId:
          '151112267540-hqsnr6j6h6g1lu7aoqpip2mdjqpkkvvi.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (error) {
      return { error: true };
    }
  };

  render() {
    return (
      <View style={styles.container}>
      <Text style={{fontSize: 30}}>WELCOME TO DOGGO!</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
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


        <Button
          title="Log In"
          onPress={this.loginUser}
        />

        <Button
          title="Sign In With Google"
          onPress={() => this.signInWithGoogleAsync()}
        />


        <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={() => this.props.navigation.navigate('Register')}>
          <Text style={{ fontSize: 15 }}>
            New to Where's DogGo? <Text style={{ fontWeight: "500", color: "pink" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

      </View>
    );
  }
}

export default LoginScreen;

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
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30
  },
  error: {
    color: "green",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  }
});
