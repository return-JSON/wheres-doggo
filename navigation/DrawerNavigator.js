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
<<<<<<< HEAD
          title: 'ListTemplate',
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
=======
          title: 'Users',
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-search" />
>>>>>>> 1095fcd85b825e004e82e501c5f6dc1e573cc311
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
<<<<<<< HEAD
      return 'Welcome to DogGO!';
    case 'Links':
      return 'Links to learn more';
=======
      return 'Where\'s Doggo?';
>>>>>>> 1095fcd85b825e004e82e501c5f6dc1e573cc311
    case 'Camera':
      return 'Snap a pup!';
  }
}
