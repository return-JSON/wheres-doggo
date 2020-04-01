import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';

import LoadingScreen from './LoadingScreen';
import { useAuth } from './HomeScreen';
import { uploadImage } from '../src/api';

export default function CameraScreen({ navigation }) {
  const { initializing, user } = useAuth();
  const [loading, setLoading] = React.useState(false);

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
        setLoading(true);
        await uploadImage(user.uid, photo.uri);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  handlePress = async () => {
    await snap();
    await setLoading(false);
    await navigation.navigate('DogSnap', {
      userId: user.uid
    });
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (loading === true) {
    return (
      <View>
        <Animatable.Image
          source={require('../assets/images/corgi.gif')}
          style={{ width: 300, height: 290 }}
        />
      </View>
    );
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
