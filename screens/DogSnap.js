import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  View,
  Image,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { PupLoading } from "../components/PupLoading";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import { setPhotoUri, addPupThunk, clearDog } from "../src/reducers/camera";

class DogSnap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.addPup = this.addPup.bind(this);
  }

  componentDidMount() {
    this.props.setPhotoUri(this.props.route.params.photo);
  }

  componentWillUnmount() {
    this.props.clearDog();
  }

  addPup = async (userId, props, breed, navigation) => {
    try {
      this.setState({
        isLoading: true,
      });
      await this.props.addPupThunk(userId, props);
      await this.setState({
        isLoading: false,
      });
      await Alert.alert(
        `${breed} has been added to DoggoDex!`,
        "Back to catching more doggos!",
        [
          {
            text: "Ok!",
            onPress: () => navigation.navigate("Camera"),
          },
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
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: this.props.camera.imageUrl,
            }}
          />
          <Text style={styles.title}> 🐶 Breed not found </Text>
          <View style={styles.buttonContainer}>
            <Card style={styles.tryAgain}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Camera")}
              >
                <Text style={styles.buttonText}>Try again</Text>
              </TouchableOpacity>
            </Card>
            <Card>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("Add A Breed", {
                    userId: this.props.route.params.userId,
                  })
                }
              >
                <Text style={styles.buttonText}>Find breed</Text>
              </TouchableOpacity>
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
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: this.props.camera.imageUrl,
            }}
          />
          <Text style={styles.title}>
            Are you sure this is a picture of a dog?
          </Text>
          <Card>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Camera")}
            >
              <Text style={styles.buttonText}>Find dogs</Text>
            </TouchableOpacity>
          </Card>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: this.props.route.params.photo.uri,
            }}
          />
          <Text style={styles.title}>
            Wowie! What a cute {this.props.camera.breed}😍
          </Text>
          <Card>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addPup(
                  this.props.route.params.userId,
                  this.props.camera,
                  this.props.camera.breed,
                  navigation
                );
              }}
            >
              <Text style={styles.buttonText}>Add to DoggoDex</Text>
            </TouchableOpacity>
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
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    width: 300,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Avenir",
    color: Colors.text,
  },
  button: {
    alignItems: "center",
    color: "white",
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  tryAgain: {
    backgroundColor: Colors.cancel,
  },
});

const mapState = (state) => {
  return {
    camera: state.camera,
  };
};

const mapDispatch = (dispatch) => ({
  setPhotoUri: (uri) => dispatch(setPhotoUri(uri)),
  addPupThunk: (userId, obj) => dispatch(addPupThunk(userId, obj)),
  clearDog: () => dispatch(clearDog()),
});

export default connect(mapState, mapDispatch)(DogSnap);
