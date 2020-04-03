import * as React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';
import {
   VictoryChart,
   VictoryPie,
   VictoryScatter,
   VictoryVoronoiContainer, VictoryTooltip
} from 'victory-native';
import { db } from '../config/firebase';
import { breedFreq, geoBreedFreq, editCity } from '../constants/utilityFunctions';
import Colors from '../constants/Colors'
import DogPoint from '../components/DogPoint'

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
            editCity(allDogsArr)
            setAllDogs(allDogsArr);
         });
      return () => unsubscribe();
   }, []);


   return (
      <ScrollView>
         <VictoryChart containerComponent={<VictoryVoronoiContainer />}>
            <VictoryScatter
               // animate={{ duration: 2000 }}
               labelComponent={<VictoryTooltip renderInPortal={false}/>}
               labels={({ datum }) => `${datum.breed} ${datum.count}`}
               bubbleProperty='count'
               maxBubbleSize={20}
               minBubbleSize={8}
               data={geoBreedFreq(allDogs)}
               x='boroughOrCity'
               y='breed'
               // dataComponent={<DogPoint />}
               // style={{ data: { fill: "#c43a31" } }}
            />
         </VictoryChart>
         <VictoryPie
            // animate={{ duration: 2000 }}
            data={breedFreq(allDogs)}
            x='breed'
            y='count'
            sortKey='count'
            innerRadius={70}
            colorScale={['tomato', 'orange', 'gold', 'cyan', 'navy']}
         />
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.lightBlue
   }
});
