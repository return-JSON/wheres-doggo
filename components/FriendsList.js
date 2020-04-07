import * as React from 'react';
import { StyleSheet, View ,Image, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import DogTile from '../components/DogTile';
import { db } from '../config/firebase';
import Colors from '../constants/Colors'
import { style } from 'd3';

export default function FriendsList(props) {
  const [loading, setLoading] = React.useState(true);
  const [userFriend, setFriend] = React.useState({ firstName: '' });
  const userId = props.userId;
  const navigation = useNavigation();

  React.useEffect(() => {
    // get user's friends
    if (props.friend && userId) {
      const unsubscribe = db
        .collection('users')
        .doc(props.friend)
        .onSnapshot(
          snapshot => {
            let friend = snapshot.data();
            friend.id = props.friend;
            setLoading(false);
            setFriend(friend);
          },
          err => {
            setError(err);
          }
        );

      return () => unsubscribe();
    } else {
      setLoading(false);
      setFriend({ firstName: 'This user does not have any friends yet.' });
    }
  }, [userId]);

  handlePress = id => {
    navigation.push('UserProfile', {
      userId: id
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handlePress(userFriend.id)}><Text style={styles.text}>{userFriend.firstName}</Text></TouchableOpacity>
      <Image
      source={require('../assets/images/paw.png')}
      style={{width: 25, height: 25}}/>
    </View>
  );
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
  },
  text:{
    marginTop: 5,
    fontFamily: "Avenir-Light",
    color: Colors.cluster,
    fontSize: 20,
    textAlign: "center"
  }
});
