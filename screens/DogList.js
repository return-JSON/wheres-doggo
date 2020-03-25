import * as React from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";

// this component renders a card for every dog in the db.

const DogList = props => {
  const dog = props.dog;
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>{dog.breed}</Text>
          <Text>Last seen:</Text>
        <View style={styles.mapContainer}>
          <Image
            style={{ width: 200, height: 200 }}
            source={{
              uri: dog.imageUrl
            }}
          />
          <MapView
            style={styles.map}
            region={{
              latitude: dog.lastSeen["F"],
              longitude: dog.lastSeen["V"],
              latitudeDelta: 0.09,
              longitudeDelta: 0.09
            }}
          >
            <Circle
              center={{
                latitude: dog.lastSeen["F"],
                longitude: dog.lastSeen["V"]
              }}
              radius={500}
              strokeWidth={2}
              strokeColor={"white"}
            />
            <Marker
              coordinate={{
                latitude: dog.lastSeen["F"],
                longitude: dog.lastSeen["V"]
              }}
              title={dog.breed}
              image={require("../src/img/dog.png")}
            />
          </MapView>
        </View>
        <Text>{dog.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 80,
    marginRight: 80,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "50%",
    marginVertical: 10,
  },
  mapContainer: {
    flexDirection: "row",
    alignItems: 'center',
    width: "100%"
  },
  map: {
    height: '80%',
    width: '80%'
  }
});

export default DogList;
