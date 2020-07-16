import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';

import { PupLoading } from '../components/PupLoading';
import { useAuth } from './HomeScreen';
import { resizeFromCamera } from '../src/api';

export default function CameraScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState(null);

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
        let camPhoto = await this.camera.takePictureAsync();
        let photo = await resizeFromCamera(camPhoto.uri);
        setLoading(true);
        return photo;
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  handlePress = async () => {
    let photo = await snap();
    await setLoading(false);
    await navigation.navigate('DogSnap', {
      userId: user.uid,
      photo: photo,
    });
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (loading === true) {
    return <PupLoading />;
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
        ref={(ref) => (this.camera = ref)}
      >
        <TouchableOpacity
          style={{
            flex: 0.1,
            alignSelf: 'center',
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
