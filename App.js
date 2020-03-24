import * as React from 'react';
import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import InsideApp from './screens/InsideApp'



  const AppSwitchNavigator = createSwitchNavigator({
    LoadingScreen: LoadingScreen,
    LoginScreen:LoginScreen,
    DashboardScreen: InsideApp,
  });

const AppNavigator= createAppContainer(AppSwitchNavigator);

export default function App() {
  return(
    <AppNavigator />
  )
}


