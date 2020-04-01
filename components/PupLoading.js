import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';

export function PupLoading() {
  return (
    <View>
      <Animatable.Image
        source={require('../assets/images/corgi.gif')}
        style={{ width: 300, height: 290 }}
      />
    </View>
  );
}
