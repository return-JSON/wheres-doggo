import GOOGLE_VISION_API_KEY from '../../config/constants';
import { geopointMaker, dogDocer } from '../../constants/utilityFunctions';
import { db } from '../../config/firebase';
import firebase from '../../config/firebase';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';

export const submitToGoogle = async image => {
  try {
    let body = JSON.stringify({
      requests: [
        {
          features: [{ type: 'LABEL_DETECTION', maxResults: 10 }],
          image: {
            source: {
              imageUri: image
            }
          }
        }
      ]
    });
    let response = await fetch(
      'https://vision.googleapis.com/v1/images:annotate?key=' +
        'AIzaSyAtR83KT3-6fEk457SwYGqcVkYXPlnnLW4',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: body
      }
    );
    let responseJson = await response.json();
    console.log(responseJson);
    //
    return responseJson;
  } catch (error) {
    console.log(error);
  }
};

export const getLocation = async () => {
  let location = await Location.getCurrentPositionAsync({});
  return location;
};

export const uploadImage = async (userId, uri, breed = 'last-image') => {
  let resizedPhoto = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 500 } }],
    { compress: 0.5, format: 'png', base64: false }
  );
  const response = await fetch(resizedPhoto.uri);
  const blob = await response.blob();
  const ref = await firebase
    .storage()
    .ref()
    .child(`${userId}/${breed}`);
  const snapshot = await ref.put(blob);
  blob.close();
};

export const addPup = async (userId, stateObj) => {
  let urlBreed = stateObj.breed.replace(' ', '%20');
  stateObj.imageUrl = `https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/${userId}%2F${urlBreed}?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d`;
  let geopoint = new firebase.firestore.GeoPoint(
    stateObj.location.coords.latitude,
    stateObj.location.coords.longitude
  );
  const breedId = dogDocer(stateObj.breed);
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
  await userRef
    .collection('dogs')
    .doc(breedId)
    .set(stateObj);
};
