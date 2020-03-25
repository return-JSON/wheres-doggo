import GOOGLE_CLOUD_VISION_API_KEY from '../../config/constants';

export default submitToGoogle = async () => {
  console.log('test');
  try {
    let image =
      'https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/userid%2Flast-image?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d';
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
        GOOGLE_CLOUD_VISION_API_KEY,
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
    return responseJson;
  } catch (error) {
    console.log(error);
  }
};
