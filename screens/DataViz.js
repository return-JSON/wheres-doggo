import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
// import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import {
   VictoryBar,
   VictoryChart,
   VictoryLine,
   VictoryPie
} from 'victory-native';
import { db } from '../config/firebase';
// import { dogsData } from '../src/data/data';

export default function App(props) {
   const [allDogs, setAllDogs] = React.useState([]);
   React.useEffect(() => {
      // dogs database (allDogs)
      const unsubscribe = db.collectionGroup('dogs').onSnapshot(
         // will need to change to userDogs for real data
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
               // console.log('hello', doc.id, ' => ', doc.data());
            });
            // setLoading(false);
            setAllDogs(allDogsArr);
         }
         //  err => {
         //     setError(err);
         //  }
      );
      return () => unsubscribe();
   }, []);
   console.log('allDogs', allDogs);

   // util function to aggregate breeds
   function breedFreq(arr) {
      let breedList = [];
      arr.forEach(dog => {
         const i = breedList.findIndex(x => x.breed === dog.breed);
         if (i <= -1) {
            // if breed doesn't exist in list
            breedList.push({ breed: dog.breed, count: 1 });
         } else {
            // breed does exist in list
            breedList[i].count++;
         }
      });
      return breedList;
   }
   const data = breedFreq(allDogs)
   console.log(data)

   return (
      <ScrollView>
         <VictoryChart>
            <VictoryBar horizontal
               data = {data}
               x = 'breed'
               y = 'count'
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
