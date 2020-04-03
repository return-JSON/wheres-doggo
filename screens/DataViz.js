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
import { breedFreq } from '../constants/utilityFunctions';
// import { dogsData } from '../src/data/data';

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
   console.log('allDogs', allDogs);

   // util function to aggregate breeds
   // function breedFreq(arr) {
   //    let breedList = [];
   //    arr.forEach(dog => {
   //       const i = breedList.findIndex(x => x.breed === dog.breed);
   //       if (i <= -1) breedList.push({ breed: dog.breed, count: 1 });
   //       else breedList[i].count++;
   //    });
   //    return breedList;
   // }

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
   console.log('allDogs', allDogs);

   // function breedFreqByGeo(arr) {
   //    let breedList = [];

   // }

   return (
      <ScrollView>
         <VictoryChart>
            <VictoryScatter
               bubbleProperty='count'
               maxBubbleSize={25}
               minBubbleSize={5}
               data={[ // sample data
                  { location: 'NYC', breed: 'shiba', count: 30 },
                  { location: 'NYC', breed: 'werewolf', count: 40 },
                  { location: 'Paterson, NJ', breed: 'shiba', count: 25 },
                  { location: 'Chicago, IL', breed: 'rat terrier', count: 10 },
                  { location: 'Alaska', breed: 'german shep', count: 45 }
               ]}
               x='location'
               y='breed'
            />
         </VictoryChart>
         <VictoryChart width={350}>
            <VictoryBar
               horizontal
               // animate={{ duration: 2000 }}
               data={breedFreq(allDogs)}
               x='breed'
               y='count'
            />
         </VictoryChart>
         <VictoryPie data={breedFreq(allDogs)} x='breed' y='count' />
         {/* <VictoryChart width={350} theme={VictoryTheme.material}>
               <VictoryBar data={data} x='quarter' y='earnings' />
            </VictoryChart> */}
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
