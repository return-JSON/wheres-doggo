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
      if (this.state.toggleView) {
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
      } else {
         return (
            <ScrollView style={styles.container}>
               {this.state.userArr.map((item, i) => {
                  return (
                     <ListItem
                        key={i}
                        chevron
                        bottomDivider
                        title={item.name}
                        subtitle={item.email}
                        onPress={() => {
                           this.setState({
                              toggleView: true,
                              userId: item.key
                           });
                           // this.props.navigation.navigate('UserProfile', {userkey: item.key})
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
