import * as React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import InsideApp from './screens/InsideApp';
import {Asset} from 'expo-asset'
import {AppLoading} from 'expo'
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import TryOut from './screens/TryOut'

import store from './src/store';

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
  LoginScreen: TryOut,
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

export default class App extends React.Component {
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
