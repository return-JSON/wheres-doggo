import * as React from 'react';
import { StyleSheet, Button, View } from 'react-native';
import DogTile from '../components/DogTile';
import { db } from '../config/firebase';

export default function FriendsList(props) {
  const [loading, setLoading] = React.useState(true);
  const [userFriend, setFriend] = React.useState({ firstName: '' });
  const userId = props.userId;
  const navigation = props.navigation;

  React.useEffect(() => {
    // get user's friends
    if (props.friend && userId) {
      const unsubscribe = db
        .collection('users')
        .doc(props.friend)
        .onSnapshot(
          snapshot => {
            let friend = snapshot.data();
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

  return (
    <View style={styles.container}>
      <Button title={userFriend.firstName} />
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
