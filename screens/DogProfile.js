import * as React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { db } from "../config/firebase";
import DogList from './DogList'

export default class DogProfile extends React.Component {
  constructor() {
    super();
    this.ref = db.collection("dogs");
    this.state = {
      isLoading: true,
      dogArr: []
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.getDogCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getDogCollection = querySnapshot => {
    // console.log('querySnapshot list template', querySnapshot)
    const dogArr = [];
    querySnapshot.forEach(res => {
      const { breed, description, imageUrl, lastSeen, points } = res.data();
      dogArr.push({
        key: res.id,
        breed,
        description,
        imageUrl,
        lastSeen,
        points
      });
    });
    this.setState({
      dogArr,
      isLoading: false
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <Text>loading..</Text>
        </View>
      );
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.state.dogArr.map((dog, i) => {
            return <DogList key={i} dog={dog} />
          })}
        </View>
        </ScrollView>
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
