import * as React from "react";
import { StyleSheet, View, Button, Modal } from "react-native";
import { WebView } from "react-native-webview";
import { slugify } from "../constants/utilityFunctions";

const LinkPage = props => {
  let fix = props.breed;
  let breed = slugify(fix);
  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.container}>
        <View>
          <Button title="Back" onPress={props.onClose} />
        </View>
        <WebView
          source={{
            uri: `https://www.petfinder.com/search/dogs-for-adoption/us/ny/new-york-city/?breed%5B0%5D=${breed}`
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default LinkPage;
