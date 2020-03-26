import * as React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { fetchDogs } from '../src/reducers/dog'
import { connect } from 'react-redux'
import { db } from "../config/firebase";
import DogList from './DogList'

class DogProfile extends React.Component {
  constructor() {
    super();
    this.ref = db.collection("dogs");
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.fetchDogs()
    console.log('I AM A DOG!!!!', this.props.dogs)
    this.setState({
      isLoading: false
    })
  }

  render() {
    const dogs = this.props.dogs
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          {dogs.map((dog, i) => {
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

const mapState = state => {
  return {
    user: state.user,
    dogs: state.dogs
  }
}

const mapDispatch = dispatch => ({
  fetchDogs: () => dispatch(fetchDogs())
})

export default connect(mapState, mapDispatch)(DogProfile)
