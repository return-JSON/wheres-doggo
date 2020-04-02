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
// import {findCityCounty} from '../src/api'
// import { dogsData } from '../src/data/data';

export default function App(props) {
   const [allDogs, setAllDogs] = React.useState([]);
   React.useEffect(() => {
      const unsubscribe = db.collectionGroup('userDogs').onSnapshot(
         snapshot => {
            const allDogsArr = [];
            snapshot.forEach(doc => {
               const { breed, imageUrl, location, points } = doc.data();
               allDogsArr.push({
                  key: doc.id,
                  breed,
                  imageUrl,
                  location,
                  points
               });
            });
            setAllDogs(allDogsArr);
         }
      );
      return () => unsubscribe();
   }, []);
   // console.log('allDogs', allDogs);




   // util function to aggregate breeds
   function breedFreq(arr) {
      let breedList = [];
      arr.forEach(dog => {
         const i = breedList.findIndex(x => x.breed === dog.breed);
         if (i <= -1) breedList.push({ breed: dog.breed, count: 1 });
         else breedList[i].count++;
      });
      return breedList;
   }
   const data = breedFreq(allDogs)
   // console.log(data)

   return (
      <ScrollView>
         <VictoryChart width={350} theme={VictoryTheme.material}>
            <VictoryBar
               horizontal
               // animate={{ duration: 2000 }}
               data={data}
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
