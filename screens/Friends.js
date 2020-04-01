import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, Button, Alert } from 'react-native';

import LoadingScreen from './LoadingScreen';
import { setPhotoUri, addPupThunk } from '../src/reducers/camera';

class AddFriend extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button title="Add to friends !" />
      </View>
    );
  }
}
x;

const mapState = state => {
  return {
    camera: state.camera
  };
};

const mapDispatch = dispatch => ({
  setPhotoUri: uri => dispatch(setPhotoUri(uri)),
  addPupThunk: (userId, obj) => dispatch(addPupThunk(userId, obj))
});

export default connect(mapState, mapDispatch)(AddFriend);
