import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
// import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import {
   VictoryBar,
   VictoryChart,
   VictoryPie,
   VictoryScatter
} from 'victory-native';
import { db } from '../config/firebase';
import { breedFreq, geoBreedFreq } from '../constants/utilityFunctions';

export default function DataViz(props) {
   const [allDogs, setAllDogs] = React.useState([]);
   React.useEffect(() => {
      const unsubscribe = db
         .collectionGroup('userDogs')
         .onSnapshot(snapshot => {
            const allDogsArr = [];
            snapshot.forEach(doc => {
               const {
                  breed,
                  imageUrl,
                  location,
                  points,
                  city,
                  county
               } = doc.data();
               allDogsArr.push({
                  key: doc.id,
                  breed,
                  imageUrl,
                  location,
                  city,
                  county,
                  points
               });
            });
            setAllDogs(allDogsArr);
         });
      return () => unsubscribe();
   }, []);

   // function to set borough if NYC
   allDogs.forEach(dog => {
      if (dog.city === 'New York, New York') {
         if (dog.county === 'New York County')
            dog.boroughOrCity = 'Manhattan, New York';
         else if (dog.county === 'Kings County')
            dog.boroughOrCity = 'Brooklyn, New York';
         else if (dog.county === 'Queens County')
            dog.boroughOrCity = 'Queens, New York';
         else if (dog.county === 'Richmond County')
            dog.boroughOrCity = 'Staten Island, New York';
         else if (dog.county === 'Bronx County')
            dog.boroughOrCity = 'Bronx, New York';
         else dog.boroughOrCity = dog.city;
      } else {
         dog.boroughOrCity = dog.city;
      }
   });

   return (
      <ScrollView>
         <VictoryChart>
            <VictoryScatter
               bubbleProperty='count'
               maxBubbleSize={25}
               minBubbleSize={5}
               data={geoBreedFreq(allDogs)}
               x='boroughOrCity'
               y='breed'
            />
         </VictoryChart>
         <VictoryPie data={breedFreq(allDogs)} x='breed' y='count' />
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5fcff'
   }
});
