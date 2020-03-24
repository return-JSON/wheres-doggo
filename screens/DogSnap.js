import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Text, View, Image } from 'react-native';
import { setPhotoUri } from '../src/reducers/camera';

class DogSnap extends Component {
  componentDidMount() {
    this.props.setPhotoUri(
      'https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/userid%2Flast-image?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d'
    );
    console.log(state);
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          <Image
            style={{ width: 200, height: 200 }}
            source={{
              uri:
                'https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/userid%2Flast-image?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d'
            }}
          />
        </Text>
      </View>
    );
  }
}
const mapState = state => {
  return {
    camera: state
  };
};

const mapDispatch = dispatch => ({
  setPhotoUri: uri => dispatch(setPhotoUri(uri))
});

export default connect(mapState, mapDispatch)(DogSnap);
