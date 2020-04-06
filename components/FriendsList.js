import * as React from 'react';
import { StyleSheet, Button, View ,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import DogTile from '../components/DogTile';
import { db } from '../config/firebase';
import Colors from '../constants/Colors'

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
      <Button
      color={Colors.cluster}
        title={userFriend.firstName}
        onPress={() => handlePress(userFriend.id)}
      />
      <Image
                 source ={{uri:"https://lh3.googleusercontent.com/proxy/TuuBIjWOuvcjnHJ5InnFBd1glt93Z9nwpirhw1qdSJR1QuZRLXzMJwCMCi2u5_cNeP9datlaG5LhZBH_KIs2UfceWn9Q7FN_rnxiONr-Dsbs3fGeCs72bHDoFnBSWs5IxgJ9e7Uu4Q7Ko_InG-xMxtUFqRjvu8FGGHKWMF4hU4Pw-8bL2s2G7V9lDz28"}}
                 style={{width: 25, height: 25}}
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
