import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Text, View, Image } from 'react-native';
import { takePhoto } from '../src/reducers/camera';

class DogSnap extends Component {
  componentDidMount() {
    this.props.takePhoto(
      'https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/userid%2Flast-image?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d'
    );
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          <Image
            style={{ width: 550, height: 550 }}
            source={{
              uri: this.props.camera.uri
            }}
          />
        </Text>
      </View>
    );
  }
}
const mapState = state => {
  return {
    camera: state.camera
  };
};

const mapDispatch = dispatch => ({
  takePhoto: uri => dispatch(takePhoto(uri))
});

export default connect(mapState, mapDispatch)(DogSnap);
