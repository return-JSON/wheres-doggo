import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
// import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import {
   VictoryBar,
   VictoryChart,
   VictoryLine,
   VictoryPie,
   VictoryTheme
} from 'victory-native';
import { db } from '../config/firebase';
import { breedFreq } from '../constants/utilityFunctions'
// import { dogsData } from '../src/data/data';

export default function DataViz(props) {
   const [allDogs, setAllDogs] = React.useState([]);
   React.useEffect(() => {
      const unsubscribe = db.collectionGroup('userDogs').onSnapshot(
         snapshot => {
            const allDogsArr = [];
            snapshot.forEach(doc => {
               const { breed, imageUrl, location, points, city, county } = doc.data();
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
         }
      );
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
         if (dog.county === 'New York County') dog.boroughOrCity = 'Manhattan, New York'
         else if (dog.county === 'Kings County') dog.boroughOrCity = 'Brooklyn, New York'
         else if (dog.county === 'Queens County') dog.boroughOrCity = 'Queens, New York'
         else if (dog.county === 'Richmond County') dog.boroughOrCity = 'Staten Island, New York'
         else if (dog.county === 'Bronx County') dog.boroughOrCity = 'Bronx, New York'
         else dog.boroughOrCity = dog.city
      } else {
         dog.boroughOrCity = dog.city
      }
   })
     console.log('allDogs', allDogs);


   // function breedFreqByGeo(arr) {
   //    let breedList = [];

   // }


   return (
      <ScrollView>
         <VictoryChart width={350}>
            <VictoryBar
               horizontal
               // animate={{ duration: 2000 }}
               data={breedFreq(allDogs)}
               x='breed'
               y='count'
            />
         </VictoryChart>
         <VictoryChart>
            <VictoryLine />
         </VictoryChart>
         <VictoryPie />
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
