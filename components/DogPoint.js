import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';

export default class DogPoint extends React.Component {
   render() {
       const { boroughOrCity, breed } = this.props;
      const cat = '😻';
      return (
         <Text breed={breed} boroughOrCity={boroughOrCity} fontSize={30}>
            {cat}
         </Text>
      );
   }
}
