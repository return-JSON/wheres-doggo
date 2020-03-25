import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput,TouchableOpacity } from 'react-native';
import firebase from '../config/firebase';



class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      errorMessage: null
    };
  }


  signUpUser = () => {
    try {
      const { email, password } = this.state;
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (results) {
          if (results.additionalUserInfo.isNewUser) {
            firebase
              .firestore()
              .collection('users')
              .doc(results.user.uid)
              .set({
                uid: results.user.uid,
                email: results.user.email,
                created_at: Date.now()
              })
          }
        })
    } catch (error) {
      (error => this.setState({ errorMessage: error.message }))
    }

  };


  render() {
    return (
      <View style={styles.container}>
        <Text>{"Hello!\nSign up to get started"}</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
        </View>

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Full Name"
          placeholderTextColor="#9a73ef"
          autoCapitalize="none"
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />

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
          title="Join"
          onPress={this.signUpUser}
        />

        <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={() => this.props.navigation.navigate('LoginScreen')}>
          <Text style={{fontSize: 15 }}>
            Already Have An Account? Log In
          </Text>
        </TouchableOpacity>


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
