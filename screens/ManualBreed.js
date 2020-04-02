import React, { useState } from "react";
import { connect } from "react-redux";
import { Image, StyleSheet, Picker, View, Button, Alert } from "react-native";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";

import Card from "./Card";
import { addPup } from "../src/api";
import { dogDocer, urlBreed } from "../constants/utilityFunctions";
import { db } from "../config/firebase";
import firebase from "../config/firebase";
import { PupLoading } from "../components/PupLoading";
import { breedList } from "../constants/dog";

const addPupTwo = async (userId, obj) => {
  let pup = {};
  const { breed, imageUrl, latitude, longitude } = obj;
  let breedId = dogDocer(breed)
  let geopoint = new firebase.firestore.GeoPoint(latitude, longitude);
  pup.location = geopoint;
  pup.breed = breed;
  pup.imageUrl = imageUrl;
  const dogRef = await db.collection('dogs').doc(breedId)
  let dogObj = await dogRef.get()
  dogObj = { ...dogObj.data() }
  pup.points = dogObj.points;
  await dogRef.update({ lastSeen: pup.location })
  const userRef = db.collection('users').doc(userId)
  let user = await userRef.get()
  user = { ...user.data() }
  if (!user.points) {
    user.points = 0;
  }
  let points = user.points + pup.points;
  await userRef.update({ points: points })
  await userRef.collection('userDogs').doc(breedId).set(pup)
};

function ManualBreed(props) {
  const [selectedBreed, setSelectedBreed] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let breeds = breedList;
  let userId = props.route.params.userId;
  let navigation = props.navigation;

  const handlePress = async () => {
    try {
      let newPup = {
        breed: selectedBreed,
        imageUrl: props.camera.imageUrl,
        latitude: props.camera.location.coords.latitude,
        longitude: props.camera.location.coords.longitude
      };
      setIsLoading(true)
      await addPupTwo(userId, newPup);
      setIsLoading(false)
      Alert.alert(
        `${selectedBreed} has been added to your DoggoDex!`,
        [
          {
            text: "See DoggoDex",
            onPress: () => navigation.navigate("Home")
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
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
            onValueChange={(itemValue, itemIndex) =>
              setSelectedBreed(itemValue)
            }
          >
            {breeds.map((breed, idx) => {
              return <Picker.Item key={idx} label={breed} value={breed} />;
            })}
          </Picker>
          <Card>
            <Button color={"white"} title="Add Pup" onPress={handlePress} />
          </Card>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  selectContainer: {
    height: "30%",
    width: "60%",
    maxWidth: "80%",
    alignSelf: "center"
  }
});

const mapState = state => {
  return {
    camera: state.camera
  };
};

export default connect(mapState, null)(ManualBreed);
