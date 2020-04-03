import * as React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { db } from "../config/firebase";

import { PupLoading } from "../components/PupLoading";
import { editCity } from "../constants/utilityFunctions";
import DogList from "./DogList";

export default function DogProfile(props) {
  const [dogs, setDogs] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.collectionGroup("userDogs").onSnapshot(snapshot => {
      const allDogsArr = [];
      snapshot.forEach(doc => {
        const { breed, imageUrl, location, points, city, county } = doc.data();
        allDogsArr.push({
          key: doc.id,
          breed,
          imageUrl,
          location,
          city,
          county,
          points
        });
      });
      setDogs(allDogsArr);
    });
    return () => unsubscribe();
  }, []);

  editCity(dogs);

  return (
    <ScrollView style={{ backgroundColor: "#D3E9FF" }}>
      <View style={styles.container}>
        {dogs.map((dog, i) => {
          if (dog.boroughOrCity) {
            return <DogList key={i} dog={dog} />;
          }
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D3E9FF"
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
