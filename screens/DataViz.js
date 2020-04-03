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

class CustomLabel extends React.Component {
   render() {
      return (
         <g>
            <VictoryLabel {...this.props} />
            <VictoryTooltip
               {...this.props}
               x={200}
               y={250}
               orientation='top'
               pointerLength={0}
               cornerRadius={50}
               flyoutWidth={100}
               flyoutHeight={100}
               flyoutStyle={{ fill: 'black' }}
            />
         </g>
      );
   }
}

CustomLabel.defaultEvents = VictoryTooltip.defaultEvents;

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
      <ScrollView>
         <View style={styles.container}>
            <Text style={styles.title}>Breeds Found By City/Borough</Text>
            <VictoryChart
               height={375}
               width={400}
               padding={{ left: 75, right: 100, top: 20, bottom: 40 }}
               containerComponent={<VictoryVoronoiContainer />}
            >
               <VictoryAxis
                  tickLabelComponent={<VictoryLabel angle={15} />}
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
                  labels={({ datum }) => `${datum.breed}\n${datum.count}`}
                  bubbleProperty='count'
                  maxBubbleSize={20}
                  minBubbleSize={8}
                  data={geoBreedFreq(allDogs)}
                  x='boroughOrCity'
                  y='breed'
               />
            </VictoryChart>

            <Text style={styles.title}>Total Breed Distribution</Text>
            <VictoryPie
               height={400}
               padding={{ top: 20, bottom: 80, left: 65, right: 65 }}
               data={breedFreq(allDogs)}
               x='breed'
               y='count'
               sortKey='count'
               innerRadius={70}
               labelRadius={125}
               colorScale={['tomato', 'orange', 'gold', 'cyan', 'navy']}
               labels={({ datum }) => `${datum.breed}\n${datum.count}`}
            />
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5fcff'
   },
   title: {
      fontSize: 20,
      textAlign: 'center',
      paddingTop: 25
   }
});
