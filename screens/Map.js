import * as React from "react";
import { Image, View, StyleSheet, Text, Alert } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { db } from "../config/firebase";

// render markers wherever there are dogs

export default class Map extends React.Component {
  constructor() {
    super();
    this.ref = db.collection("dogs");
    this.state = {
      isLoading: true,
      coords: {
        latitude: 40.705015,
        longitude: -74.009175,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09
      },
      dogArr: [],
      marker: {
        image: require("../src/img/dog.png")
      }
    };
    this.getDogCoords = this.getDogCoords.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.getDogCoords);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  showMessage = breed => {
    Alert.alert("Best buddy!", `It's the best ${breed} around.`, [
      { text: "Go Back", style: "cancel" }
    ]);
    return;
  }

  getDogCoords = querySnapshot => {
    const dogArr = [];
    querySnapshot.forEach(res => {
      const { lastSeen, breed, description, points } = res.data();
      dogArr.push({
        lastSeen,
        breed,
        description,
        points
      });
    });
    console.log("LOOK HERE", dogArr);
    this.setState({
      dogArr,
      isLoading: false
    });
  };

  render() {
    console.log("LOOOOOK HERE", this.state.dogArr);
    const image = this.state.marker.image;
    const dogArr = this.state.dogArr;
    return (
      <View style={styles.container}>
        <MapView style={styles.mapContainer} region={this.state.coords}>
          {dogArr.map((dog, idx) => {
            return (
              <Marker
                key={idx}
                coordinate={{
                  latitude: dog.lastSeen["F"],
                  longitude: dog.lastSeen["V"]
                }}
                image={image}
              >
                <Callout onPress={()=>this.showMessage(dog.breed)}>
                  <Text>{dog.breed}</Text>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});
