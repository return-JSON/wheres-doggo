import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import { properCase } from '../constants/utilityFunctions'
import Colors from '../constants/Colors'

// this component renders a card for every dog passed down as props.

const DogList = props => {
  const dog = props.dog;
  dog.breed = properCase(dog.breed);



  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{dog.breed}</Text>
          <Text style={styles.text}>Last seen: {dog.boroughOrCity}</Text>
          <Image
            style={{ width: 200, height: 200 }}
            source={{
              uri: dog.imageUrl
            }}
          />
        </View>
        <Text style={styles.text}>Points: {dog.points}</Text>
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
    color: Colors.text
  },
  text:{
    textAlign:'center',
    fontSize: 15,
    marginTop: 1,
    fontFamily:'Avenir',
    color: Colors.text
  }
});

export default DogList;
