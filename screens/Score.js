import * as React from 'react';
import {
   StyleSheet,
   View,
   Text
} from 'react-native';
import LoadingScreen from './LoadingScreen'
import { ListItem } from 'react-native-elements';
import { db } from '../config/firebase';



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
      const userArr = [];
      querySnapshot.forEach(res => {
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
      return (
         <Text>SCORE:</Text>

      )
   }
}






const styles = StyleSheet.create({
   container: {
      flex: 1
   }
});