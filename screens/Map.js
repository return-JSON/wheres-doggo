import * as React from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker, Callout } from "react-native-maps";
import { db } from "../config/firebase";
import AwesomeAlert from "react-native-awesome-alerts";
import Colors from "../constants/Colors";
import { properCase, sentenceCase } from "../constants/utilityFunctions";
import LinkPage from "./LinkPage";
import { getLocation } from "../src/api";

// renders user location according to cell phone
let lat;
let long;

const getLoc = async () => {
  let location = await getLocation();
  const { latitude, longitude } = location.coords;
  lat = latitude || 40.705015;
  long = longitude || -74.009175;
};

getLoc();

export default class Map extends React.Component {
  constructor() {
    super();
    this.ref = db.collection("dogs");
    this.state = {
      showAlert: false,
      webView: false,
      currentBreed: null,
      currentDescription: null,
      slug: null,
      isLoading: true,
      location: {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
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

  showAlert = (breed, description) => {
    this.setState({
      showAlert: true,
      currentBreed: breed,
      currentDescription: description
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  showLink = () => {
    this.setState({
      webView: true
    });
  };

  hideLink = () => {
    this.setState({
      webView: false
    });
  };

  getDogCoords = querySnapshot => {
    const dogArr = [];
    querySnapshot.forEach(res => {
      let { lastSeen, breed, description, points } = res.data();
      breed = properCase(breed);
      description = sentenceCase(description);
      dogArr.push({
        lastSeen,
        breed,
        description,
        points
      });
    });
    this.setState({
      dogArr,
      isLoading: false
    });
  };

  render() {
    const { dogArr, showAlert } = this.state;
    const image = this.state.marker.image;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapContainer}
          initialRegion={this.state.location}
          clusterColor={Colors.cluster}
        >
          {dogArr.map((dog, idx) => {
            return (
              <Marker
                tracksViewChanges={false}
                key={idx}
                coordinate={{
                  latitude: dog.lastSeen["F"],
                  longitude: dog.lastSeen["V"]
                }}
                image={image}
              >
                <Callout
                  onPress={() => this.showAlert(dog.breed, dog.description)}
                >
                  <Text>{dog.breed}</Text>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={this.state.currentBreed}
          message={this.state.currentDescription}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Go Back"
          confirmText="Find Dogs"
          confirmButtonColor={Colors.cluster}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.showLink();
          }}
        />
        <LinkPage
          visible={this.state.webView}
          breed={this.state.currentBreed || "boston terrier"}
          onClose={this.hideLink}
        />
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
