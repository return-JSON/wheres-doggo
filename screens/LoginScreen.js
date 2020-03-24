import React, {Component} from 'react';
import{
    View,
    Text,
    StyleSheet,
    Button,
    TextInput,
    Alert
} from 'react-native';
import * as Google from 'expo-google-app-auth'
import firebase from 'firebase'
import * as Facebook from 'expo-facebook'






class LoginScreen extends Component{
    constructor(props){
        super(props)

        this.state =({
            email:'',
            password:''
        })
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user !== null){
                console.log(user)
            }
        })
    }

    signUpUser = (email, password) => {
        try{
            if(this.state.password.length < 6){
                alert("Please enter atleast 6 characters")
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(email,password)

        }catch(error){
            console.log(error.toString())
        }
    };

    loginUser = (email, password) =>{
        try{
            firebase.auth().signInWithEmailAndPassword(email,password).then(function(user){
                console.log(user)
            })
        }catch(error){
            console.log(error.toString())
        }
    }

//FACEBOOK LOGIN
    // async loginWithFacebook(){
    //     const {type,token} = await Facebook.logInWithReadPermissionsAsync('826104554466560', {permissions:['public_profile']});

    //     if(type === 'success'){
    //         const credential = firebase.auth.FacebookAuthProvider.credential(token)

    //         firebase.auth().signInWithCredential(credential).catch((error) => {
    //             console.log(error)
    //         })
    //     }
    // }

    async logIn() {
        try {
          await Facebook.initializeAsync('826104554466560');
          const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }


//
    isUserEqual = (googleUser, firebaseUser)=>{
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              return true;
            }
          }
        }
        return false;
      };
      

  onSignIn = (googleUser) =>{
        console.log('Google Auth Response', googleUser);
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
            );

            firebase.auth().signInWithCredential(credential)
            .then(function(result){
                console.log('user signed in');
                if(result.additionalUserInfo.isNewUser){
                firebase.database()
                .ref('/users/' + result.user.uid)
                .set({
                    gmail:result.user.email,
                    profile_picture:result.additionalUserInfo.profile.picture,
                    locale:result.additionalUserInfo.profile.locale,
                    first_name:result.additionalUserInfo.profile.given_name,
                    last_name:result.additionalUserInfo.profile.family_name,
                    created_at:Date.now()})
                }else{
                    firebase.database()
                .   ref('/users/' + result.user.uid).update({
                    last_logged_in:Date.now()
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
        }.bind(this));
      };


signInWithGoogleAsync = async() =>{
    try{
        const result = await Google.logInAsync({
            behavior:'web',
            iosClientId: '151112267540-hqsnr6j6h6g1lu7aoqpip2mdjqpkkvvi.apps.googleusercontent.com',
            scopes:['profile', 'email']

        })
        if(result.type === 'success'){
            this.onSignIn(result)
            return result.accessToken
        }else{
            return {cancelled: true}
        }
    }catch(error){
        return {error:true}
    }
};


    render(){
        return(
            <View style={styles.container}>
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               placeholderTextColor = "#9a73ef"
               autoCapitalize = "none"
               onChangeText = { (email) => this.setState({email})}/>

            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               placeholderTextColor = "#9a73ef"
               autoCapitalize = "none"
               secureTextEntry={true}
               onChangeText = {(password) => this.setState({password})}/>
                        
            <Button
                 title = "Sign Up"
                 onPress={() => this.signUpUser(this.state.email, this.state.password)} />
            <Button
                 title = "Log In"
                 onPress={() => this.loginUser(this.state.email, this.state.password)} />


                <Button
                 title = "Sign In With Google"
                 onPress={() => this.signInWithGoogleAsync()} />

                <Button
                 title = "Sign In With Facebook"
                 onPress={() => this.logIn()} 

                 />
            </View>
        )
    }
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent: 'center'
    },
    input: {
        margin: 4,
        height: 40,
        width:300,
        borderColor: '#7a42f4',
        borderWidth: 1
     },
     submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
     }
})