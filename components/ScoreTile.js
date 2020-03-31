import * as React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

export default function ScoreTile(props) {
  // const [loading, setLoading] = React.useState(true)
  const { user } = props;

  return (
    <View style={styles.container}>
      <Text>{user.firstName}</Text>
      <Text>{user.points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    margin: 10,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  }
});
