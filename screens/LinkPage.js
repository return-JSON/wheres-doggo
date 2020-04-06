import * as React from "react";
import { StyleSheet, View, Button, Modal } from "react-native";
import { WebView } from "react-native-webview";
import { slugify } from "../constants/utilityFunctions";

import Colors from "../constants/Colors";

const LinkPage = (props) => {
  let fix = props.breed;
  let breed = slugify(fix);
  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.container}>
        <WebView
          source={{
            uri: `https://www.petfinder.com/search/dogs-for-adoption/us/ny/new-york-city/?breed%5B0%5D=${breed}`,
          }}
        />
        <View style={styles.buttonContainer}>
          <Button color="white" title="Close" onPress={props.onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: 10,
    backgroundColor: 'gray',
  },
});

export default LinkPage;
