import * as React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

import { properCase } from '../constants/utilityFunctions'

export default function DogTile(props) {
  // const [loading, setLoading] = React.useState(true)
  const { dog } = props;
  dog.breed = properCase(dog.breed)

  if (dog.source === 'database') {
    return (
      <View style={styles.container}>
        <Image style={styles.databaseImage} source={{ uri: dog.imageUrl }} />
      </View>
    );
  } else if (dog.source === 'user') {
    return (
      <View style={styles.container}>
        <Image style={styles.userImage} source={{ uri: dog.imageUrl }} />
        <Text>{dog.breed}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '40%',
    margin: 10,
    alignItems: 'center'
  },
  databaseImage: {
    opacity: 0.3,
    width: 125,
    height: 125
  },
  userImage: {
    width: 125,
    height: 125
  }
});
