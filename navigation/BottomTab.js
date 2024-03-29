import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import Camera from '../screens/CameraScreen';
import Colors from '../constants/Colors'

const Tab = createMaterialBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTab({ navigation, route }) {
  return (
    <Tab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      activeColor="#EFC04A"
      style={{ backgroundColor: '#165076' }}
    >
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={{
          tabBarLabel: 'snap!',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="camera" color={color} size={26} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
  getFocusedRouteNameFromRoute(route)?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Where\'s Doggo?';
    case 'Camera':
      return 'Snap a pic!';
  }
}
