import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Alert
} from "react-native";
import { DogTile, FriendsList } from "../components";
import Card from '../components/Card'
import { addFriend } from "../src/api";
import { db } from "../config/firebase";
import { useAuth } from "./HomeScreen";
import Colors from '../constants/Colors'

export default function UserProfile(props) {
  const { initializing, user } = useAuth();
  const [error, setError] = React.useState(false);
  const [loaing, setLoading] = React.useState(true);
  const [userId, setId] = React.useState('');
  const [userProf, setProf] = React.useState({ friends: [] });
  const [userDogs, setUserDogs] = React.useState([]);
  const navigation = props.navigation;

  React.useEffect(() => {
    let tempId = '';
    if (props.userId) {
      tempId = props.userId;
    } else {
      const route = props.route;
      tempId = route.params.userId;
    }
    const unsubscribe = db
      .collection('users')
      .doc(tempId)
      .onSnapshot(
        doc => {
          setId(tempId);
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
        .collection("users")
        .doc(userId)
        .collection("userDogs")
        .onSnapshot(
          snapshot => {
            const dogsArr = [];
            snapshot.forEach(doc => {
              const { breed, imageUrl, location } = doc.data();
              dogsArr.push({
                key: doc.id,
                source: "user",
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

  buttonRender = (myId, yourId, name) => {
    if (!userProf.friends.includes(myId) && myId !== yourId) {
      return (
        <View>
          <Card style={styles.buttonContainer}>
            <Button
              title="Add Friend"
              color="white"
              onPress={() => handlePress(myId, yourId, name)}
            />
          </Card>
        </View>
      );
    }
  };
  handleButtonPress = async (myId, yourId, name) => {
    try {
      if (myId === yourId) {
        Alert.alert("I'm sorry, but you cannot become your own friend...");
      }
      let passFail = await addFriend(myId, yourId);
      if (passFail) {
        await Alert.alert(`Success! You are now friends with ${name}`);
      }
    } catch (err) {
      Alert.alert("Something has gone wrong.");
      console.log(err);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
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
          <Text style={styles.textinside2}> Points: {userProf.points}</Text>
        </View>

        <View style={styles.dogsCard}>
          <Text style={styles.textinside}>DogGos Collected</Text>

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
        {buttonRender(user.uid, userId, userProf.firstName)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardChild: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: Colors.background
  },
  profilePic: {
    width: 175,
    height: 175
  },
  text: {
    alignItems: "center",
    fontSize: 30,
    marginVertical: 15,
    fontFamily: "Avenir",
    color: Colors.text
  },
  userinfo: {
    flex: 1,
    marginVertical: 2,
    alignItems: "center",
    width: "90%"
  },
  dogsCard: {
    paddingVertical: 10,
    marginVertical: 15,
    backgroundColor: "white",
    width: "90%",
    borderWidth: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: Colors.border
  },
  textinside: {
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Avenir",
    color: Colors.border
  },
  PointCard: {
    backgroundColor: "white",
    width: "90%",
    borderWidth: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: Colors.border
  },
  textinside2: {
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Avenir",
    color: Colors.text
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    width: 300,
    maxWidth: "50%"
  }
});
