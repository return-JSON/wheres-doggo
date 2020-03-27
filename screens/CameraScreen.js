import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';

import { uploadImage } from '../src/api';

export default function CameraScreen({ navigation }) {
  const userId = useSelector(state => state.user.id);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      let camObject = await Camera.requestPermissionsAsync();
      let locationObject = await Permissions.askAsync(Permissions.LOCATION);
      const camStatus = camObject.status;
      const locationStatus = locationObject.status;
      setHasPermission(camStatus === 'granted' && locationStatus === 'granted');
    })();
  }, []);

  snap = async () => {
    if (this.camera) {
      try {
        let photo = await this.camera.takePictureAsync();
        await uploadImage(userId, photo.uri);
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
    return (
      <Text>This app needs access to your camera and location, pls! 🐶</Text>
    );
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
