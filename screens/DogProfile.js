import * as React from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import { db } from "../config/firebase";
import MapView, { Marker, Circle } from "react-native-maps";

export default class DogProfile extends React.Component {
  constructor() {
    super();
    // shiba will be replaced with dogs in user's doggodex
    this.ref = db.collection("dogs").doc("shiba");
    this.state = {
      isLoading: true,
      dogProf: {}
    };
  }

  componentDidMount() {
    this.ref.get().then(doc => {
      if (doc.exists) {
        this.setState({
          dogProf: doc.data(),
          //    key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  render() {
    let dog = this.state.dogProf;
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <Text>loading..</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.userCard}>
          <View>
            <Text>{dog.breed}</Text>
          </View>
          <View style={styles.cardChild}>
            <View>
              <Image
                style={{ width: 200, height: 200 }}
                source={{
                  uri: dog.imageUrl
                }}
              />
            </View>
            <View>
              <Text>Last seen:</Text>
              <MapView
                style={styles.map}
                region={{
                  latitude: dog.lastSeen["F"],
                  longitude: dog.lastSeen["V"],
                  latitudeDelta: 0.09,
                  longitudeDelta: 0.09
                }}
              >
                <Circle center={{latitude: dog.lastSeen["F"], longitude: dog.lastSeen['V']}} radius={500} strokeWidth={2} strokeColor={'white'} />
                <Marker
                  coordinate={{
                    latitude: dog.lastSeen["F"],
                    longitude: dog.lastSeen["V"]
                  }}
                  title={dog.breed}
                  image={require('../src/img/dog.png')}
                />
              </MapView>
            </View>
          </View>
          <View>
            <Text>{dog.description}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  map: {
    height: 200,
    width: 200,
    marginVertical: 10
  },
  userCard: {
    backgroundColor: "#fff",
    width: "50%"
  },
  cardChild: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});
