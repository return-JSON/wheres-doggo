import * as React from "react";
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from "react-native";
// import { fetchUser } from '../src/reducers/user'; (reminder to delete user if needed)
import * as firebase from "firebase";
import DogTile from "../components/DogTile";
import { dog } from "../constants/dog";
import { db } from "../config/firebase";
import { homeScreenDogs } from "../constants/utilityFunctions";
import Modal, { ModalContent } from "react-native-modals";
import Card from "../components/Card";
import Colors from "../constants/Colors";

export const useAuth = () => {
  const [state, setState] = React.useState(() => {
    const user = firebase.auth().currentUser;
    return { initializing: !user, user };
  });
  function onChange(user) {
    setState({ initializing: false, user });
  }
  React.useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);
  return state;
};

export default function HomeScreen(props) {
  const { initializing, user } = useAuth();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [userId, setId] = React.useState("");
  const [userDogs, setUserDogs] = React.useState([]);
  const [allDogs, setAllDogs] = React.useState([]);
  const [showModal, setModal] = React.useState(false);
  /*
   // initialize our default state
   // when the id attribute changes (including mount)
   // subscribe to the document and update
   // our state when it changes. */

  React.useEffect(() => {
    // dogs database (allDogs)
    const unsubscribe = db.collection("dogs").onSnapshot(
      snapshot => {
        const allDogsArr = [];
        snapshot.forEach(doc => {
          const { breed, description, imageUrl, lastSeen, points } = doc.data();
          allDogsArr.push({
            key: doc.id,
            source: "database",
            breed,
            description,
            imageUrl,
            lastSeen,
            points
          });
        });
        setLoading(false);
        setAllDogs(allDogsArr);
      },
      err => {
        setError(err);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  React.useEffect(() => {
    // userId
    const unsubscribe = db
      .collection("users")
      .where("email", "==", user.email)
      .onSnapshot(
        doc => {
          setId(doc.docs[0].id);
        },
        err => {
          setError(err);
        }
      );

    // returning the unsubscribe function will ensure that
    // we unsubscribe from document changes when our id
    // changes to a different value.
    return () => unsubscribe();
  }, [userId]);

  React.useEffect(() => {
    // user dogs (userDogs)
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

  const uniqueDogs = homeScreenDogs(userDogs, allDogs);

  signOutUser = () => {
    firebase.auth().signOut();
  };
  if (initializing) {
    return <Text>Loading</Text>;
  }

  return (
    <ScrollView style={{backgroundColor:"#D3E9FF"}}>
      <View style={styles.container}>
        <Text style={styles.text}>Hello, {user.displayName}</Text>

        <Modal visible={showModal} onTouchOutside={() => setModal(false)}>
          <ModalContent>
            <Text style={styles.insideText}>Welcome!</Text>
            <Text style={styles.textinside2}>
              Your main goal: Catch dogs to complete your DoggoDex.
            </Text>
            <Text style={styles.textinside2}>
              To start: Swipe right on your screen, open the camera and snap a
              picture of the dog you found.
            </Text>
            <Text style={styles.textinside2}>
              The more dogs you find, the more points you collect.
            </Text>
            <Text style={styles.textinside2}>
              Get out there and find DogGos!
            </Text>
          </ModalContent>
        </Modal>

        <View style={styles.dogsCard}>
          <Text style={styles.insideText}> Your DogGos</Text>
          <View style={styles.cardChild}>
            {uniqueDogs.map(dog => {
              return <DogTile dog={dog} key={dog.key} />;
            })}
          </View>
        </View>
        <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.button2} onPress={() => setModal(true)}>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color:'white'}}>How to Play</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.button} onPress={signOutUser}>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white'}}>Sign Out</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: Colors.background
  },
  dogsCard: {
    marginTop: 15,
    backgroundColor: "white",
    width: "90%",
    borderWidth: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: Colors.border
  },
  cardChild: {
    marginTop: 10,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  text: {
    alignItems: "center",
    fontSize: 30,
    marginTop: 15,
    fontFamily: "Avenir",
    color: Colors.text
  },
  insideText: {
    marginTop: 5,
    fontFamily: "Avenir-Light",
    color: "blue",
    fontSize: 20,
    textAlign: "center"
  },
  textinside2: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "Avenir",
    color: Colors.text,
    textAlign: "center",
    alignContent: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: 300,
    maxWidth: "80%"
  },
  buttontext:{
    fontSize: 30,
    color:'white'
  },
  button: {
    backgroundColor: Colors.cancel,
    height: 60,
    width:120,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  button2: {
    backgroundColor: Colors.purple,
    height: 60,
    width:120,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  }
});
