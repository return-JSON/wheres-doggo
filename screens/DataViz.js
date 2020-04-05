import * as React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
   VictoryChart,
   VictoryPie,
   VictoryScatter,
   VictoryAxis,
   VictoryVoronoiContainer,
   VictoryTooltip,
   VictoryLabel,
   VictoryTheme
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
                  labels={({ datum }) => `${datum.breed}\n${datum.count}`}
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



            <View style={styles.containerIn}>
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
                  colorScale={['navy','gold']}
                  labels={({ datum }) => `${datum.breed}\n${datum.count}`}
                  style={{
                     labels: {fontSize: 15, fill: "#c43a31", padding: 9
                     },
                     data: {fillOpacity: 0.9, stroke: "white", strokeWidth:3}}}

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
      marginTop: 90
   }
});
