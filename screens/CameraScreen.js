import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useFirebase } from 'react-redux-firebase';

import { Camera } from 'expo-camera';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  snap = async () => {
    if (this.camera) {
      try {
        let photo = await this.camera.takePictureAsync();
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        var ref = await firebase
          .storage()
          .ref()
          .child('userid/last-image');
        await ref.put(blob);
      } catch (err) {
        console.log(err);
      }
    }
  };

  handlePress = async () => {
    await snap();
    await navigation.navigate('DogSnap');
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} ref={ref => (this.camera = ref)}>
        <TouchableOpacity
          style={{
            flex: 0.1,
            alignSelf: 'flex-end',
            alignItems: 'center'
          }}
          onPress={handlePress}
        >
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
            {' '}
            snap{' '}
          </Text>
        </TouchableOpacity>
      </Camera>
    </View>
  );
}
