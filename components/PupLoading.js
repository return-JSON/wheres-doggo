import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export function PupLoading() {
  return (
    <View style={styles.container}>
      <Animatable.Image
        source={require('../assets/images/corgi.gif')}
        style={{ width: 300, height: 290 }}
      />
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
