import * as React from "react";
// import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import { NavigationContainer } from "@react-navigation/native";
import TabBarIcon from "../components/TabBarIcon";
import {
  HomeScreen,
  Camera,
  MyProfile,
  DogProfile,
  DoggoMap,
  Score,
  UserList,
  DataViz
} from "../screens";

const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = "Home";

export default function DrawerNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <Drawer.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Get Started",
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-home" />
          )
        }}
      />

      <Drawer.Screen
        name="Map"
        component={DoggoMap}
        options={{
          title: "DoggoMap",
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-map" />
          )
        }}
      />

      <Drawer.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          title: "My Profile",
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          )
        }}
      />

      <Drawer.Screen
        name="DogProfile"
        component={DogProfile}
        options={{
          title: "DoggoDex",
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-heart" />
          )
        }}
      />

      <Drawer.Screen
        name="UserList"
        component={UserList}
        options={{
          title: "Users",
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-search" />
          )
        }}
      />

      <Drawer.Screen
        name="DataViz"
        component={DataViz}
        options={{
          title: "Insights",
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-stats" />
          )
        }}
      />

      <Drawer.Screen
        name="Camera"
        component={Camera}
        options={{
          title: "Camera",
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-camera" />
          )
        }}
      />

      <Drawer.Screen
        name="Score"
        component={Score}
        options={{
          title: "Scoreboard",
          drawerIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-apps" />
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
    case "Home":
      return "Get Started";
    case "Map":
      return "DoggoMap";
    case "MyProfile":
      return "My Profile";
    case "DogProfile":
      return "DoggoDex";
    case "UserList":
      return "Users";
    case "DataViz":
      return "Insights";
    case "Camera":
      return "📸  Snap a Pup  📸";
    case "Score":
      return "🏆  Leaderboard  🏆 ";
  }
}
