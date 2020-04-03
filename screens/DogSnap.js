import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View, Image, Button, Alert, StyleSheet } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";

import { PupLoading, Card } from "../components";
import Colors from "../constants/Colors";
import { setPhotoUri, addPupThunk, clearDog } from "../src/reducers/camera";

class DogSnap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.addPup = this.addPup.bind(this);
  }

  componentDidMount() {
    this.props.setPhotoUri(
      `https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/${this.props.route.params.userId}%2Flast-image?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d`
    );
  }

  componentWillUnmount() {
    this.props.clearDog();
  }

  addPup = async (userId, props, breed, navigation) => {
    try {
      this.setState({
        isLoading: true
      });
      await this.props.addPupThunk(userId, props);
      await this.setState({
        isLoading: false
      });
      await Alert.alert(
        `${breed} has been added to DoggoDex!`,
        "Back to catching more doggos!",
        [
          {
            text: "Ok!",
            onPress: () => navigation.navigate("Camera")
          }
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const navigation = this.props.navigation;

    if (!this.props.camera.breed || this.state.isLoading) {
      return <PupLoading />;
    } else if (this.props.camera.breed === "🐶 breed not found") {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: this.props.camera.imageUrl
            }}
          />
          <Text style={styles.text}> 🐶 Breed not found </Text>
          <View style={styles.buttonContainer}>
            <Card style={{ backgroundColor: Colors.cancel }}>
              <Button
                color={"white"}
                title="Try again"
                onPress={() => navigation.navigate("Camera")}
              />
            </Card>
            <Card>
              <Button
                color={"white"}
                title="Find breed"
                onPress={() =>
                  navigation.navigate("Add A Breed", {
                    userId: this.props.route.params.userId
                  })
                }
              />
            </Card>
          </View>
        </View>
      );
    } else if (this.props.camera.breed === "Not a dog") {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: this.props.camera.imageUrl
            }}
          />
          <Text style={styles.text}>
            Are you sure this is a picture of a dog?
          </Text>
          <Card>
            <Button
              color={"white"}
              title="Find dogs"
              onPress={() => navigation.navigate("Camera")}
            />
          </Card>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: this.props.camera.imageUrl
            }}
          />
          <Text style={styles.text}>
            Wowie! What a cute {this.props.camera.breed}😍
          </Text>
          <Card>
            <Button
              color={"white"}
              title="Add to DoggoDex"
              onPress={() => {
                this.addPup(
                  this.props.route.params.userId,
                  this.props.camera,
                  this.props.camera.breed,
                  navigation
                );
              }}
            />
          </Card>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: 300,
    maxWidth: "70%"
  },
  text: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Avenir",
    color: Colors.text
  }
});

const mapState = state => {
  return {
    camera: state.camera
  };
};

const mapDispatch = dispatch => ({
  setPhotoUri: uri => dispatch(setPhotoUri(uri)),
  addPupThunk: (userId, obj) => dispatch(addPupThunk(userId, obj)),
  clearDog: () => dispatch(clearDog())
});

export default connect(mapState, mapDispatch)(DogSnap);
