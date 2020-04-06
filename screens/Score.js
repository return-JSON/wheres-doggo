import * as React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import ScoreTile from '../components/ScoreTile';

import { db } from '../config/firebase';
import { useAuth } from './HomeScreen';
import { scoreBoardCombo } from '../constants/utilityFunctions';
import Colors from '../constants/Colors'

export default function Score(props) {
  const { initializing, user } = useAuth();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [userId, setId] = React.useState('');
  const [userArr, setUserArr] = React.useState([]);

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
    <View style={styles.container}>
      <View style={styles.PointCard}>
        <View style={styles.titleContainer}>
          <Text style={styles.textInside}>User</Text>
          <Text style={styles.textInside}>Points</Text>
        </View>
        {userArr.map((user, i) => {
          return <ScoreTile key={i} user={user} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.yellow
  },
  titleContainer: {
    width: '100%',
    margin: 10,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  PointCard: {
    backgroundColor: '#F9F8F8',
    width: '90%',
    paddingVertical: 10,
    borderWidth: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: Colors.border
  },
  textInside: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Avenir',
    color: Colors.border
  }
});
