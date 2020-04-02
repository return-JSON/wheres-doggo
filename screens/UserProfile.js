import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import { DogTile, FriendsList } from '../components';
import { db } from '../config/firebase';
// import { useAuth } from './HomeScreen';

export default function UserProfile(props) {
  console.log('props in userprofile', props);
  // const { initializing, user } = useAuth();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [userId, setId] = React.useState(props.userId);
  const [userProf, setProf] = React.useState({ friends: [] });
  const [userDogs, setUserDogs] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .doc(userId)
      .onSnapshot(
        doc => {
          setId(userId);
          setProf(doc.data());
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

  console.log(userId, userDogs);

  // if (initializing) {
  //    return <Text>Loading</Text>;
  // }

  return (
    <ScrollView style={{ backgroundColor: '#D3E9FF' }}>
      <View style={styles.container}>
        <View style={styles.userinfo}>
          <Image
            style={styles.profilePic}
            source={{
              uri: userProf.profilePicture
            }}
          />
          <Text style={styles.text}>{userProf.firstName}</Text>
        </View>

        <View style={styles.PointCard}>
          <Text style={styles.textinside2}> Points:{userProf.points}</Text>
        </View>

        <View style={styles.dogsCard}>
          <Text style={styles.textinside}>Doggos Collected:</Text>

          <View style={styles.cardChild}>
            {userDogs.map(dog => (
              <DogTile dog={dog} key={dog.key} />
            ))}
          </View>
        </View>
        <View style={styles.dogsCard}>
          <View>
            <Text style={styles.textinside}>
              {userProf.firstName}'s Friends:
            </Text>
          </View>
          <View style={styles.cardChild}>
            {userProf.friends.map(friend => (
              <FriendsList key={friend} friend={friend} userId={userId} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardChild: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#D3E9FF'
  },
  profilePic: {
    width: 175,
    height: 175
  },
  text: {
    alignItems: 'center',
    fontSize: 30,
    marginTop: 15,
    fontFamily: 'Avenir',
    color: '#031A6B'
  },
  userinfo: {
    flex: 1,
    marginTop: 2,
    alignItems: 'center',
    width: '90%'
  },
  dogsCard: {
    marginTop: 15,
    backgroundColor: '#fff',
    width: '90%',
    borderWidth: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: '#031A6B'
  },
  textinside: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 15,
    fontFamily: 'Avenir',
    color: '#031A6B'
  },
  PointCard: {
    marginTop: 15,
    backgroundColor: '#fff',
    width: '90%',
    borderWidth: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: '#031A6B'
  },
  textinside2: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 15,
    fontFamily: 'Avenir',
    color: '#031A6B'
  }
});
