import * as React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
   VictoryChart,
   VictoryPie,
   VictoryScatter,
   VictoryAxis,
   VictoryVoronoiContainer,
   VictoryTooltip,
   VictoryLabel
} from 'victory-native';
import { db } from '../config/firebase';
import {
   breedFreq,
   geoBreedFreq,
   editCity
} from '../constants/utilityFunctions';

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
                  breed: breed.split(' ').join('\n'),
                  imageUrl,
                  location,
                  city,
                  county,
                  points
               });
            });
            editCity(allDogsArr);
            setAllDogs(allDogsArr);
         });
      return () => unsubscribe();
   }, []);

   return (
      <ScrollView style={{ backgroundColor: '#D3E9FF' }}>
         <View style={styles.container}>
            <View style={styles.container}>
               <Text style={styles.title}>Breeds Found By City/Borough</Text>
               <VictoryChart
                  domain={{ x: [0, 4], y: [0, 12] }}
                  height={690}
                  width={450}
                  padding={{ left: 75, right: 100, top: 30, bottom: 150 }}
                  containerComponent={<VictoryVoronoiContainer />}
               >
                  <VictoryAxis
                     tickLabelComponent={<VictoryLabel angle={90} />}
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
                     sortOrder='descending'
                     labelComponent={
                        <VictoryTooltip
                           activateData={true}
                           renderInPortal={false}
                           constrainToVisibleArea={true}
                        />
                     }
                     labels={({ datum }) => `${datum.breed}\n${datum.count}`}
                     bubbleProperty='count'
                     maxBubbleSize={15}
                     minBubbleSize={8}
                     data={geoBreedFreq(allDogs)}
                     x='boroughOrCity'
                     y='breed'
                     style={{
                        data: { fill: '#031A6B', width: 12 },
                        padding: 35
                     }}
                  />
               </VictoryChart>
            </View>

            <View style={styles.containerIn}>
               <Text style={styles.title}>Total Breed Distribution</Text>
               <VictoryPie
                  height={410}
                  padding={{ top: 85, bottom: 80, left: 65, right: 65 }}
                  data={breedFreq(allDogs)}
                  x='breed'
                  y='count'
                  innerRadius={70}
                  labelRadius={140}
                  colorScale={[
                     '#031A6B',
                     '#FFE066',
                     '#FCC244',
                     'tomato',
                     '#247BA0'
                  ]}
                  labels={({ datum }) => `${datum.breed}\n${datum.count}`}
                  style={{
                     labels: { fontSize: 12, fill: '#031A6B', padding: 9 },
                     data: {
                        fillOpacity: 0.9,
                        stroke: 'white'
                     }
                  }}
               />
            </View>
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   title: {
      textAlign:'center',
      alignItems:'center',
      fontSize: 30,
      marginTop: 15,
      fontFamily:'Avenir',
      color:'#031A6B'
   },
   containerIn: {
      flex: 1,
      marginTop: 25
   }
});
