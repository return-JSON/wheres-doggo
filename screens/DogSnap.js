import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Text, View, Image, Button } from 'react-native';
import { setPhotoUri, addPupThunk } from '../src/reducers/camera';

class DogSnap extends Component {
  componentDidMount() {
    this.props.setPhotoUri(
      `https://firebasestorage.googleapis.com/v0/b/wheres-doggo.appspot.com/o/${this.props.user.id}%2Flast-image?alt=media&token=82207119-f59c-4f2b-acdc-ab02dec71c9d`
    );
  }

  // handlePress = async () => {
  //   await this.props.addPupThunk(this.props.camera);
  // };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={{ width: 300, height: 300 }}
          source={{
            uri: this.props.camera.uri
          }}
        />
        <Text>Wowie! What a cute {this.props.camera.breed}😍</Text>
        <Button
          title="Add this pup to my DoggoDex!"
          onPress={() => {
            this.props.addPupThunk(this.props.user.id, this.props.camera);
          }}
        />
      </View>
    );
  }
}

const mapState = state => {
  return {
    camera: state.camera,
    user: state.user
  };
};

const mapDispatch = dispatch => ({
  setPhotoUri: uri => dispatch(setPhotoUri(uri)),
  addPupThunk: (userId, obj) => dispatch(addPupThunk(userId, obj))
});

export default connect(mapState, mapDispatch)(DogSnap);
