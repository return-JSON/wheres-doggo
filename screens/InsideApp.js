import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from '../navigation/DrawerNavigator';
import DogSnap from './DogSnap';
import MyProfile from './MyProfile';
import UserProfile from './UserProfile';
import ManualBreed from './ManualBreed';
import FriendsList from '../components/FriendsList';
import useLinking from '../navigation/useLinking';
import LinkPage from './LinkPage'
import Colors from '../constants/Colors'
const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      <NavigationContainer
        ref={containerRef}
        initialState={initialNavigationState}
      >
        <Stack.Navigator>
          <Stack.Screen name="Where's DogGo?" component={DrawerNavigator} />
          <Stack.Screen name="Find A Dog" component={LinkPage} />
          <Stack.Screen name="DogSnap" component={DogSnap} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="Add A Breed" component={ManualBreed} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  }
});
