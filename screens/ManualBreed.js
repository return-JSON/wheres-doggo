import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Image, StyleSheet, Picker, View, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';

import Card from '../components/Card';
import { getBreedList, uploadImage } from '../src/api';
import { dogDocer, urlMaker } from '../constants/utilityFunctions';
import { db } from '../config/firebase';
import firebase from '../config/firebase';
import { PupLoading } from '../components/PupLoading';

const addPupTwo = async (userId, obj) => {
  try {
    let pup = {
      breed: obj.breed
    };
    let urlBreed = urlMaker(pup.breed);
    pup.imageUrl = `https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/${userId}%2F${urlBreed}?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d`;
    let breedId = dogDocer(pup.breed);
    let geopoint = new firebase.firestore.GeoPoint(obj.latitude, obj.longitude);
    pup.location = geopoint;
    const dogRef = await db.collection('dogs').doc(breedId);
    let dogObj = await dogRef.get();
    dogObj = { ...dogObj.data() };
    pup.points = dogObj.points;
    await dogRef.update({ lastSeen: pup.location });
    const userRef = db.collection('users').doc(userId);
    let user = await userRef.get();
    user = { ...user.data() };
    if (!user.points) {
      user.points = 0;
    }
    let points = user.points + pup.points;
    await userRef.update({ points: points });
    await userRef
      .collection('userDogs')
      .doc(breedId)
      .set(pup);
  } catch (err) {
    console.log(err);
  }
};

function ManualBreed(props) {
  const [selectedBreed, setSelectedBreed] = useState('');
  const [breeds, setBreeds] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let userId = props.route.params.userId;
  let navigation = props.navigation;

  React.useEffect(() => {
    // get user's friends
    (async () => {
      let breeds = await getBreedList();
      setBreeds(breeds);
    })();
  }, []);

  const pupperAdder = async () => {
    try {
      let newPup = {
        breed: selectedBreed,
        imageUrl: props.camera.imageUrl,
        latitude: props.camera.location.coords.latitude,
        longitude: props.camera.location.coords.longitude
      };
      await uploadImage(userId, newPup.imageUrl, newPup.breed);
      await addPupTwo(userId, newPup);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = async (breed, navigation) => {
    setIsLoading(true);
    await pupperAdder();
    setIsLoading(false);
    Alert.alert(
      `${breed} has been added to DoggoDex!`,
      'Back to catching more doggos!',
      [
        {
          text: 'Ok!',
          onPress: () => navigation.navigate('Camera')
        }
      ],
      { cancelable: false }
    );
  };

  if (isLoading) {
    return <PupLoading />;
  } else
    return (
      <View style={styles.container}>
        <Image
          style={{ marginTop: 30, width: 300, height: 300 }}
          source={{
            uri: props.camera.imageUrl
          }}
        />
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={selectedBreed}
            onValueChange={itemValue => setSelectedBreed(itemValue)}
          >
            {breeds.map(breed => {
              return <Picker.Item key={breed} label={breed} value={breed} />;
            })}
          </Picker>
          <Card>
            <Button
              color={'white'}
              title="Add Pup"
              onPress={() => {
                handlePress(selectedBreed, navigation);
              }}
            />
          </Card>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  selectContainer: {
    height: '30%',
    width: '60%',
    maxWidth: '80%',
    alignSelf: 'center'
  }
});

const mapState = state => {
  return {
    camera: state.camera
  };
};

export default connect(mapState, null)(ManualBreed);
