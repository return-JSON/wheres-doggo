import * as React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import ScoreTile from '../components/ScoreTile';

import { db } from '../config/firebase';
import { useAuth } from './HomeScreen';
import { scoreBoardCombo } from '../constants/utilityFunctions';

export default function Score(props) {
  const { initializing, user } = useAuth();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [userId, setId] = React.useState('');
  const [userArr, setUserArr] = React.useState([]);

  getCollection = async querySnapshot => {
    try {
      let data = await querySnapshot.data();
      await console.log(`Received doc snapshot: ${data}`);
    } catch (err) {}
    // ...
  };

  React.useEffect(() => {
    // user database
    const unsubscribe = db.collection('users').onSnapshot(
      snapshot => {
        const userArr = [];
        snapshot.forEach(doc => {
          const { email, firstName, points } = doc.data();
          userArr.push({
            key: doc.id,
            email,
            firstName,
            points
          });
        });
        setLoading(false);
        setUserArr(scoreBoardCombo(userArr));
      },
      err => {
        setError(err);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  React.useEffect(() => {
    // userId
    const unsubscribe = db
      .collection('users')
      .where('email', '==', user.email)
      .onSnapshot(
        doc => {
          setId(doc.docs[0].id);
        },
        err => {
          setError(err);
        }
      );

    // returning the unsubscribe function will ensure that
    // we unsubscribe from document changes when our id
    // changes to a different value.
    return () => unsubscribe();
  }, [userId]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.dogsCard}>
          <View style={styles.cardChild}>
            <View style={styles.titleContainer}>
              <Text>User</Text>
              <Text>Points</Text>
            </View>
            {userArr.map((user, i) => {
              return <ScoreTile key={i} user={user} />;
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  cardChild: {
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  titleContainer: {
    width: '100%',
    margin: 10,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  }
});
