import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './src/reducers';
const store = createStore(reducer);
import DrawerNavigator from './navigation/DrawerNavigator';
import DogSnap from './screens/DogSnap';
import useLinking from './navigation/useLinking';
const Stack = createStackNavigator();

import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'

import {db} from './config/firebase'
import HomeScreen from './screens/HomeScreen';



  const AppSwitchNavigator = createSwitchNavigator({
    LoadingScreen: LoadingScreen,
    LoginScreen:LoginScreen,
    DashboardScreen: HomeScreen
  }); //<--- nuria code 

  const AppNavigator= createAppContainer(AppSwitchNavigator);//<--- nuria code 







export default function App(props) {
  return(
    <AppNavigator />
  )
  // const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  // const [initialNavigationState, setInitialNavigationState] = React.useState();
  // const containerRef = React.useRef();
  // const { getInitialState } = useLinking(containerRef);

  // // Load any resources or data that we need prior to rendering the app
  // React.useEffect(() => {
  //   async function loadResourcesAndDataAsync() {
  //     try {
  //       SplashScreen.preventAutoHide();

  //       // Load our initial navigation state
  //       setInitialNavigationState(await getInitialState());

  //       // Load fonts
  //       await Font.loadAsync({
  //         ...Ionicons.font,
  //         'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
  //       });
  //     } catch (e) {
  //       // We might want to provide this error information to an error reporting service
  //       console.warn(e);
  //     } finally {
  //       setLoadingComplete(true);
  //       SplashScreen.hide();
  //     }
  //   }

  //   loadResourcesAndDataAsync();
  // }, []);

  // if (!isLoadingComplete && !props.skipLoadingScreen) {
  //   return null;
  // } else {
  //   return (
  //     <Provider store={store}>
  //       <View style={styles.container}>
  //         {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
  //         <NavigationContainer
  //           ref={containerRef}
  //           initialState={initialNavigationState}
  //         >
  //           <Stack.Navigator>
  //             <Stack.Screen name="Root" component={DrawerNavigator} />
  //             <Stack.Screen name="DogSnap" component={DogSnap} />
  //           </Stack.Navigator>
  //         </NavigationContainer>
  //       </View>
  //     </Provider>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
