import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import Camera from '../screens/CameraScreen';
import UserProfile from '../screens/UserProfile';
import DogProfile from '../screens/DogProfile'
import ListTemplate from '../screens/ListTemplate';

const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function DrawerNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <Drawer.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <Drawer.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          title: 'My Profile',
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          )
        }}
      />

      <Drawer.Screen
        name="DogProfile"
        component={DogProfile}
        options={{
          title: 'DoggoDex',
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-heart" />
          )
        }}
      />

      <Drawer.Screen
        name="ListTemplate"
        component={ListTemplate}
        options={{
          title: 'Users',
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-search" />
          )
        }}
      />

      <Drawer.Screen
        name="Camera"
        component={Camera}
        options={{
          title: 'Camera',
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-camera" />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Where\'s Doggo?';
    case 'Camera':
      return 'Snap a pup!';
  }
}
