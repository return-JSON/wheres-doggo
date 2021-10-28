import * as React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoadingScreen from './screens/LoadingScreen';
import RegisterScreen from './screens/RegisterScreen';
import InsideApp from './screens/InsideApp';
import {Asset} from 'expo-asset'
import AppLoading from 'expo-app-loading'
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Login from './screens/Login'
import { LogBox } from 'react-native'
import store from './src/store';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
LogBox.ignoreAllLogs(['AppRegistry.setWrapperComponentProvider has no effect in managed Expo apps']);
LogBox.ignoreAllLogs(['Deprecated: Native Google Sign-In has been moved to Expo.GoogleSignIn'])
LogBox.ignoreLogs(['md-stats" is not a valid icon name for family "ionicons'])

const rrfConfig = { userProfile: 'users', useFirestoreForProfile: true };

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

import { decode, encode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: Login,
  Register: RegisterScreen,
  DashboardScreen: InsideApp
});

const AppNavigator = createAppContainer(AppSwitchNavigator);


function cacheImages(images){
  return images.map(image => {
    if(typeof image === 'string'){
      return Image.prefetch(image)
    } else {
      return Asset.fromModule(image).downloadAsync()
    }
  })
};

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      isReady: false
    }
  }

  async loadAssetsAsync(){
    const imageAssets = cacheImages([ require('./assets/images/corgilaying.jpg')])
    await Promise.all([...imageAssets])
  }

  render(){
    if(!this.state.isReady){
      return(
        <AppLoading
        startAsync={this.loadAssetsAsync}
        onFinish={() => this.setState({isReady:true})}
        onError={console.warn}
        />
      )
    } 
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AppNavigator />
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}
}

export default App;
