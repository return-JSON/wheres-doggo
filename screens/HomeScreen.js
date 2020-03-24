import * as React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import firebase from 'firebase';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Welcome to DogGo!!!</Text>
      <Image
        style={{ width: 300, height: 250 }}
        source={{
          uri:
            'https://i.barkpost.com/wp-content/uploads/2015/02/featmeme.jpg?q=70&fit=crop&crop=entropy&w=808&h=500'
        }}
      />
      <Button title="Sign Out" onPress={() => firebase.auth().signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
