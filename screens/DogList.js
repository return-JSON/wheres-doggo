import * as React from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";

// this component renders a card for every dog in the db.

const DogList = props => {
  const dog = props.dog;
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{dog.breed}</Text>
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
              title= {dog.breed}
              image={require("../src/img/dog.png")}
            />
          </MapView>
        </View>
        <Text style={styles.text}> {dog.description}</Text>
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
    borderWidth: 3,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    borderColor:'#031A6B',
    backgroundColor: "#fff",
    marginTop:12
  },
  card: {
    backgroundColor: "#fff",
    width: "70%",
    marginVertical: 10,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    
  },
  mapContainer: {
    flexDirection: "row",
    alignItems: 'center',
    width: "100%"
  },
  map: {
    height: '80%',
    width: '80%'
  },
  name:{
    textAlign:'center',
    fontSize: 20,
    marginTop: 1,
    fontFamily:'Avenir',
    color:'#031A6B'
  },
  text:{
    textAlign:'center',
    fontSize: 15,
    marginTop: 1,

    fontFamily:'Avenir',
    color:'#031A6B'
  }
});

export default DogList;
