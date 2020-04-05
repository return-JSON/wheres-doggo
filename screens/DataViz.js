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

   console.log('city/borough', geoBreedFreq(allDogs));

   return (
      <ScrollView style={{ backgroundColor: "#D3E9FF" }}>
         <View style={styles.container}>
         <View style={styles.container}>
            <Text style={styles.title}>Breeds Found By City/Borough</Text>
            <VictoryChart
            animate={{duration: 500 }}
            theme={VictoryTheme.material}
            domain={{ x: [0, 4], y: [0, 10] }}
               height={450}
               width={400}
               padding={{ left: 75, right: 100, top: 20, bottom: 150}}
               containerComponent={<VictoryVoronoiContainer />}
            >
               <VictoryAxis
                  tickLabelComponent={<VictoryLabel angle={90}  />}
                  style={{
                     tickLabels: {
                        padding: 5,
                        verticalAnchor: 'middle',
                        textAnchor: 'start'
                     }
                  }}
               />
               <VictoryAxis
                  width={500}
                  height={500}
                  tickLabelComponent={<VictoryLabel />}
                  dependentAxis
                  style={{
                     tickLabels: { padding: 4 }
                  }}
               />
               <VictoryScatter
                  sortKey='breed'
                  labelComponent={
                     <VictoryTooltip
                        activateData={true}
                        renderInPortal={false}
                     />
                  }
                  labels={({ datum }) => `${datum.breed}\n${datum.count}\n${datum.boroughOrCity}`}
                  bubbleProperty='count'
                  maxBubbleSize={10}
                  minBubbleSize={5}
                  data={geoBreedFreq(allDogs)}
                  x='boroughOrCity'
                  y='breed'
                  style={{ data: { fill: "navy", width: 12} ,padding:35 }}
               />
            </VictoryChart>
            </View>

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
