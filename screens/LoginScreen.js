import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from '../config/firebase';
import * as Facebook from 'expo-facebook';
import { TouchableOpacity } from 'react-native-gesture-handler';

class LoginScreen extends Component {
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

//  // FACEBOOK LOGIN
  async loginWithFacebook(){
    await Facebook.initializeAsync('826104554466560')
      const {type,token} = await Facebook.logInWithReadPermissionsAsync('826104554466560', {permissions:['public_profile']});
      behavior: Platform.OS == "ios" ? Expo.Constants.statusBarHeight < 40 ? "web" : "native" : "native"
      if(type === 'success'){
          const credential = firebase.auth.FacebookAuthProvider.credential(token)

          firebase.auth().signInWithCredential(credential).catch((error) => {
              console.log(error)
          })
      }
    }


  // async loginWithFacebook() {

  //     await Facebook.initializeAsync('826104554466560');
  //     const permissions = ['public_profile', 'email']
  //     const {
  //       type,
  //       token
  //     } = await Facebook.logInWithReadPermissionsAsync(
  //       '826104554466560',{permissions});
  //   //   if (type === 'success') {
  //   //     // Get the user's name using Facebook's Graph API
  //   //     const response = await fetch(
  //   //       `https://graph.facebook.com/me?access_token=${token}`
  //   //     );
  //   //     Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
  //   //     // await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  //   //     // const credential = firebase.auth.FacebookAuthProvider.credential(token);
  //   //     // const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential)
  //   //   } else {
  //   //     // type === 'cancel'
  //   //   }
  //   // } catch ({ message }) {
  //   //   alert(`Facebook Login Error: ${message}`);
  //   switch (type) {
  //     case 'success': {
  //       await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
  //       const credential = firebase.auth.FacebookAuthProvider.credential(token);
  //       const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential
  
  //       // Do something with Facebook profile data
  //       // OR you have subscribed to auth state change, authStateChange handler will process the profile data
        
  //       return Promise.resolve({type: 'success'});
  //     }
  //     case 'cancel': {
  //       return Promise.reject({type: 'cancel'});
  //     }
  //   }
    
  // }


  
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
      function(firebaseUser) {
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
            .then(function(result) {
              console.log('user signed in');
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  });
              } else {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
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

  <TouchableOpacity style= {{alignSelf:"center", marginTop: 32}} onPress={() => this.props.navigation.navigate('Register')}>
    <Text style={{color:'#414959', fontSize:13}}>
      New to Where's DogGo? <Text style={{fontWeight:"500", color:"pink"}}>Sign Up</Text>
    </Text>
  </TouchableOpacity>


        {/* <Button
          title="Sign Up"
          onPress={() => this.signUpUser(this.state.email, this.state.password)}
        /> */}



        <Button
          title="Log In"
          onPress={this.loginUser}
        />

        <Button
          title="Sign In With Google"
          onPress={() => this.signInWithGoogleAsync()}
        />

        <Button title="Sign In With Facebook" onPress={() => this.loginWithFacebook()} />
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
