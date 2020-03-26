import GOOGLE_VISION_API_KEY from '../../config/constants';
import * as Location from 'expo-location';

export const submitToGoogle = async image => {
  console.log('test');
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
