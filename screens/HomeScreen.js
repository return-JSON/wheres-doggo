import * as React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
// import { fetchUser } from '../src/reducers/user'; (reminder to delete user if needed)
import * as firebase from 'firebase';
import DogTile from '../components/DogTile';
import { dog } from '../constants/dog';
import { db } from '../config/firebase';
import { homeScreenDogs } from '../constants/utilityFunctions';
import Modal, { ModalContent } from 'react-native-modals'

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
  const [userId, setId] = React.useState('');
  const [userDogs, setUserDogs] = React.useState([]);
  const [allDogs, setAllDogs] = React.useState([]);
  const [showModal, setModal] = React.useState(false)
  /*
   // initialize our default state
   // when the id attribute changes (including mount)
   // subscribe to the document and update
   // our state when it changes. */

  React.useEffect(() => {
    // dogs database (allDogs)
    const unsubscribe = db.collection('dogs').onSnapshot(
      snapshot => {
        const allDogsArr = [];
        snapshot.forEach(doc => {
          const { breed, description, imageUrl, lastSeen, points } = doc.data();
          allDogsArr.push({
            key: doc.id,
            source: 'database',
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
      .collection('users')
      .where('email', '==', user.email)
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

  const uniqueDogs = homeScreenDogs(userDogs, allDogs);

  signOutUser = () => {
    firebase.auth().signOut();
  };
  if (initializing) {
    return <Text>Loading</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      <Text style={styles.text}>Hello {user.displayName}!!!</Text>
      <Button
      title="Click here to learn how to play!"
      onPress={() => setModal(true)}
      />

       <Modal visible={showModal} onTouchOutside={() => setModal(false)}>
         <ModalContent>
            <Text style={styles.insideText}>Welcome!</Text>
            <Text style={styles.textinside2}>Your main goal: Catch dogs to complete your DogDex!</Text>
            <Text style={styles.textinside2}>To start: Swipe right on your screen, open the camera and snap a picture of the dog you found</Text>
            <Text style={styles.textinside2}>The more dog you find, the more points you get</Text>
            <Text style={styles.textinside2}>Now Get Out There and Find Doggos!</Text>
      </ModalContent>
  </Modal>

        <View style={styles.dogsCard}>
          <Text style={styles.insideText}> Your DogGo Dex:</Text>
          <View style={styles.cardChild}>
            {uniqueDogs.map(dog => {
              return <DogTile dog={dog} key={dog.key} />;
            })}
          </View>
        </View>
        <Button title="Sign Out" onPress={signOutUser} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor:"#D3E9FF"
  },
  dogsCard: {
    marginTop: 15,
    backgroundColor: '#fff',
    width: '90%',
    borderWidth: 5,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    borderColor:'#031A6B'
  },
  cardChild: {
    marginTop:10,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text:{
    alignItems:'center',
    fontSize: 30,
    marginTop: 15,
    fontFamily:'Avenir',
    color:'#031A6B'
  },
  insideText:{
    marginTop:  5,
    fontFamily:'Avenir-Light',
    color:'blue',
    fontSize:20,
    textAlign:'center'
  },
  textinside2:{
    fontSize: 18,
    marginTop: 10,
    fontFamily:'Avenir',
    color:'#031A6B',
    textAlign:'center',
    alignContent: 'center',
  }
});
