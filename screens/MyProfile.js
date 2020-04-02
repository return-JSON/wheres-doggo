import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import { DogTile, FriendsList } from '../components';
// import { FriendsList } from '../components/FriendsList';
import { db } from '../config/firebase';
import { useAuth } from './HomeScreen';

export default function MyProfile(props) {
  const { initializing, user } = useAuth();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [userId, setId] = React.useState('');
  const [userProf, setProf] = React.useState({ friends: [] });
  const [userDogs, setUserDogs] = React.useState([]);
  const [userFriends, setFriends] = React.useState([]);

  React.useEffect(() => {
    // identify userid by email
    const unsubscribe = db
      .collection('users')
      .where('email', '==', user.email)
      .onSnapshot(
        doc => {
          setId(doc.docs[0].id);
          setProf(doc.docs[0].data());
        },
        err => {
          setError(err);
        }
      );
    return () => unsubscribe();
  }, [userId]);

  React.useEffect(() => {
    // get user's dogs
    if (userId) {
      const unsubscribe = db
        .collection('users')
        .doc(userId)
        .collection('userDogs')
        .onSnapshot(
          snapshot => {
            const dogsArr = [];
            snapshot.forEach(doc => {
              const { breed, imageUrl, location } = doc.data();
              dogsArr.push({
                key: doc.id,
                source: 'user',
                breed,
                imageUrl,
                location
              });
            });
            setLoading(false);
            setUserDogs(dogsArr);
          },
          err => {
            setError(err);
          }
        );

      return () => unsubscribe();
    }
  }, [userId]);

  if (initializing) {
    return <Text>Loading</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        <View>
          <Text>{userProf.firstName}</Text>
        </View>
        <View style={styles.cardChild}>
          <View>
            <Image
              style={styles.profilePic}
              source={{
                uri: userProf.profilePicture
              }}
            />
          </View>
          <View style={styles.userCard}>
            <Text>Points:{userProf.points}</Text>
          </View>
        </View>
        <View>
          <Text>Doggos collected:</Text>
        </View>
        <View style={styles.cardChild}>
          {userDogs.map(dog => (
            <DogTile dog={dog} key={dog.key} />
          ))}
        </View>
        <View>
          <Text>{userProf.firstName}'s Friends:</Text>
        </View>
        <View style={styles.cardChild}>
          {userProf.friends.map(friend => (
            <FriendsList key={friend} friend={friend} userId={userId} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  userCard: {
    backgroundColor: '#fff',
    width: '75%'
  },
  cardChild: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  profilePic: {
    width: 175,
    height: 175
  }
});
