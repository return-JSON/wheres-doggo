import * as React from 'react';
import {
   StyleSheet,
   Text,
   View,
   ScrollView,
   TouchableOpacity
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { db } from '../config/firebase';
import UserProfile from '../screens/UserProfile';

export default class UserList extends React.Component {
   constructor() {
      super();
      this.ref = db.collection('users');
      this.state = {
         isLoading: true,
         userArr: [],
         toggleView: false,
         userId: ''
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
         console.log(res.data())
         const { firstName, lastName, email, profilePicture } = res.data();
         userArr.push({
            key: res.id,
            res,
            firstName,
            lastName,
            email,
            profilePicture
         });
      });
      this.setState({
         userArr,
         isLoading: false
      });
   };

   render() {
      if (this.state.isLoading === true) {
         return (
            <View style={styles.preloader}>
               {/* <ActivityIndicator size='large' color='#9E9E9E' /> */}
               <Text>loading..</Text>
            </View>
         );
      }
      if (this.state.toggleView === true && this.state.isLoading === false) {
         return (
            <ScrollView style={styles.container}>
               <UserProfile userId={this.state.userId} />
               <TouchableOpacity
                  onPress={() => {
                     this.setState({ toggleView: false });
                  }}
               >
                  <Text>Back to User list</Text>
               </TouchableOpacity>
            </ScrollView>
         );
      } else if (this.state.toggleView === false && this.state.isLoading === false) {
         return (
            <ScrollView style={styles.container}>
               {this.state.userArr.map((item, i) => {
                  return (
                     <ListItem
                        key={i}
                        chevron
                        bottomDivider
                        title={item.firstName + ' ' + item.lastName}
                        onPress={() => {
                           this.setState({
                              toggleView: true,
                              userId: item.key
                           });
                        }}
                     />
                  );
               })}
            </ScrollView>
         );
      }
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   }
});
