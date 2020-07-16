import GOOGLE_VISION_API_KEY from '../../config/constants';
import {
  geopointMaker,
  dogBreedIdCreator,
  urlMaker,
} from '../../constants/utilityFunctions';
import { db } from '../../config/firebase';
import firebase from '../../config/firebase';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';

export const submitToGoogle = async (base64) => {
  try {
    let body = JSON.stringify({
      requests: [
        {
          image: {
            content: base64,
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10,
            },
          ],
        },
      ],
    });
    let response = await fetch(
      'https://vision.googleapis.com/v1/images:annotate?key=' +
        'AIzaSyAtR83KT3-6fEk457SwYGqcVkYXPlnnLW4',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: body,
      }
    );
    let responseJson = await response.json();
    console.log(responseJson);
    //
    return responseJson;
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

export const getLocation = async () => {
  let location = await Location.getCurrentPositionAsync({});
  return location;
};

export const getBreedList = async () => {
  try {
    const dogsRef = await db.collection('dogs').get();
    let newDogsArr = dogsRef.docs.map((doc) => doc.data().breed);
    return newDogsArr;
  } catch (err) {
    console.log(err);
  }
};

export const resizeFromCamera = async (uri) => {
  let resizedPhoto = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 500 } }],
    { compress: 0.5, format: 'png', base64: true }
  );
  return resizedPhoto;
};

export const uploadImage = async (userId, uri, breed = 'last-image') => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = await firebase.storage().ref().child(`${userId}/${breed}`);
    const snapshot = await ref.put(blob);
    blob.close();
  } catch (err) {
    console.log(err);
  }
};

const findCityCounty = async (lat, lon) => {
  const response = await fetch(
    `https://us1.locationiq.com/v1/reverse.php?key=dd8b2f143c4022&lat=${lat}&lon=${lon}&format=json&accept-language=en`
  );
  const responseJson = await response.json();
  return {
    city: `${responseJson.address.city}, ${responseJson.address.state}`,
    county: responseJson.address.county,
    country: responseJson.address.country,
  };
};

export const addPup = async (userId, stateObj) => {
  let urlBreed = urlMaker(stateObj.breed);
  stateObj.imageUrl = `https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/${userId}%2F${urlBreed}?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d`;
  let geopoint = new firebase.firestore.GeoPoint(
    stateObj.location.coords.latitude,
    stateObj.location.coords.longitude
  );

  const cityCounty = await findCityCounty(
    stateObj.location.coords.latitude,
    stateObj.location.coords.longitude
  );
  stateObj.city = cityCounty.city;
  stateObj.county = cityCounty.county;
  stateObj.country = cityCounty.country;

  const breedId = dogBreedIdCreator(stateObj.breed);
  stateObj.location = geopoint;

  const dogRef = await db.collection('dogs').doc(breedId);
  let dogObj = await dogRef.get();
  dogObj = { ...dogObj.data() };
  stateObj.points = dogObj.points;
  await dogRef.update({ lastSeen: stateObj.location });
  const userRef = db.collection('users').doc(userId);
  let user = await userRef.get();
  user = { ...user.data() };
  if (!user.points) {
    user.points = 0;
  }
  let points = user.points + stateObj.points;
  await userRef.update({ points: points });

  await userRef.collection('userDogs').doc(breedId).set(stateObj);
};

export const addFriend = async (myID, yourID) => {
  try {
    const firstUserRef = await db.collection('users').doc(myID);
    const secondUserRef = await db.collection('users').doc(yourID);

    const addMyFriend = await firstUserRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(yourID),
    });

    const addMe = await secondUserRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(myID),
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
