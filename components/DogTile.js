import * as React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function DogTile(props) {
   // const [loading, setLoading] = React.useState(true)
   const { dog } = props;

   if (dog.source === 'database') {
      return (
         <View style={styles.container}>
            {/* <BlurView tint='light' intensity={100} style={styles.notBlurred}> */}
               <Image
                  style={styles.databaseImage}
                  source={{ uri: dog.imageUrl }}
               />
            {/* </BlurView> */}
         </View>
      );
   } else if (dog.source === 'user') {
      return (
         <View style={styles.container}>
            <Image style={styles.userImage} source={{ uri: dog.imageUrl }} />
            <Text>{dog.breed}</Text>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      margin: 10
   },
   databaseImage: {
      opacity: 0.3,
      width: 150,
      height: 150
   },
   userImage: {
      width: 150,
      height: 150
   }
});
