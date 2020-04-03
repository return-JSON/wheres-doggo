import * as React from 'react';
import { StyleSheet, Button, View } from 'react-native';
import DogTile from '../components/DogTile';
import { db } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

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
      {console.log('props!u', navigation)}
      <Button
        title={userFriend.firstName}
        onPress={() => handlePress(userFriend.id)}
      />
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
  }
});
