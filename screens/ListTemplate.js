import * as React from 'react';
import {
   Image,
   Platform,
   StyleSheet,
   Text,
   View,
   ScrollView
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { db } from '../config/firebase';

// const user1 = db.collection('users').doc('user1');
// user1.get().then(doc => {
//    console.log('Document data:', doc.data());
// });

export default class ListTemplate extends React.Component {
   constructor() {
      super();
      this.ref = db.collection('users');
      this.state = {
         isLoading: true,
         userArr: []
      };
   }

   componentDidMount() {
      this.unsubscribe = this.ref.onSnapshot(this.getCollection);
   }

   componentWillUnmount() {
      this.unsubscribe();
   }

   getCollection = querySnapshot => {
      // console.log('querySnapshot list template', querySnapshot)
      const userArr = [];
      querySnapshot.forEach(res => {
         console.log('res.data from list template', res.data)
         const { name, email, photourl } = res.data();
         userArr.push({
            key: res.id,
            res,
            name,
            email,
            photourl
         });
      });
      this.setState({
         userArr,
         isLoading: false
      });
   };

   render() {
      if (this.state.isLoading) {
         return (
            <View style={styles.preloader}>
               {/* <ActivityIndicator size='large' color='#9E9E9E' /> */}
               <Text>loading..</Text>
            </View>
         );
      }
      return (
         <ScrollView style={styles.container}>
            {this.state.userArr.map((item, i) => {
               return (
                  <ListItem
                     key={i} chevron bottomDivider title={item.name} subtitle={item.email} onPress={() => { 
                        this.props.navigation.navigate('UserDetailScreen', {userkey: item.key})}} />
               );
            })}
         </ScrollView>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   }
});
