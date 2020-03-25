import React, { useState, useEffect } from 'react';
import { Button, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFirebase } from 'react-redux-firebase';

import { Camera } from 'expo-camera';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission, image] = useState(null);
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
        const snapshot = await ref.put(blob);
        blob.close();
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
      <Camera
        style={{ flex: 1, justifyContent: 'flex-end' }}
        ref={ref => (this.camera = ref)}
      >
        <TouchableOpacity
          style={{
            flex: 0.1,
            alignSelf: 'center'
          }}
          onPress={handlePress}
        >
          <Ionicons
            name="ios-aperture"
            size={60}
            color="white"
            iconStyle={{ marginBottom: 200 }}
          />
        </TouchableOpacity>
      </Camera>
    </View>
  );
}
